<template>
  <div>
    <div class="gva-search-box">
        <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="所属行业">
          <el-input v-model="searchInfo.CategoryID" placeholder="所属行业" />
        </el-form-item>
        <el-form-item label="人员类别">
          <el-input v-model="searchInfo.CategoryName" placeholder="人员类别" />
        </el-form-item>
        <el-form-item label="核酸规则">
          <el-cascader
            v-model="searchInfo.State"
            style="width:100%"
            :options="queryStateOptions"
            :show-all-levels="false"
            :props="{ multiple:false,checkStrictly: true,label:'state',value:'state_id',emitPath:false}"
            :clearable="false"
          />
        </el-form-item>

        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>  
    <div class="gva-table-box">
       <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="openDialog(add)">新增</el-button>
      </div>
      <el-table :data="tableData">
        <!-- <el-table-column align="left" label="ID" min-width="70" prop="id" /> -->
        <el-table-column
          align="left"
          label="所属行业"
          min-width="100"
          prop="hy_name"
        />
        <el-table-column
          align="left"
          label="人员类别"
          min-width="100"
          prop="rylb_name"
        />
        <el-table-column
          align="left"
          label="核酸规则"
          min-width="100"
          prop="hesuan_time"
        />

        <!-- <el-table-column label="操作" min-width="130" fixed="right" > -->
        <el-table-column align="left" label="操作" min-width="100">
          <template #default="scope">
            <el-button
              type="text"
              icon="edit"
              size="small"
              @click="editIndustry(scope.row)"
              >编辑</el-button
            >
            
            <el-button
              type="text"
              icon="Share"
              size="small"
              @click="delclassify(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>

      <el-dialog v-model="dialogForm" :before-close="closeDialog" :title="dialogTitle" >
        <el-form ref="apiForm" :model="form" :rules="rules" label-width="120px" style="width:50%">
            <el-form-item label="所属行业" prop="hy_name">
            <el-input   autocomplete="off" />
            </el-form-item>
            <el-form-item label="人员类别" prop="rylb_name">
            <el-input  autocomplete="off" />
            </el-form-item>
            <el-form-item label="核酸时间" prop="hesuan_time">
            <el-input autocomplete="off" />
            </el-form-item>
            
        </el-form>
        <template #footer>
            <div class="dialog-footer">
            <el-button size="small" @click="closeDialog">取 消</el-button>
            <el-button size="small" type="primary" @click="enterDialog">确 定</el-button>
            </div>
        </template>
    </el-dialog>

    </div>


    
  </div>
</template>

<script setup>
import { nextTick, ref, watch ,toRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategory, createExaCustomer,deletePlaceRoom} from '@/api/Category.js'
const tableData = ref([])
const searchInfo = ref({})
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const apiForm =ref([])
tableData.value = []


// 重置按钮
const onReset = () => {
  searchInfo.value = {}
}

// 分页
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 分页渲染
const getTableData = async(value) => {
    let rqt = { page: page.value, pageSize: pageSize.value }
    if(value) {
        rqt = { page: page.value, pageSize: pageSize.value, ...value }   
    } 
    console.log(rqt);
  const table = await getCategory(rqt)
  if (table.code === 0) {
    // console.log(table)
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

// 增加弹窗
const dialogTitle = ref('新增人员类别')
const dialogForm = ref(false)
const dialogFlag = ref('add')
const openDialog = (key) => {
  switch (key) {
    case 'add':
        dialogFlag.value = 'add'
  dialogForm.value = true
      dialogTitle.value = '新增隔离点房间'
      break
    case 'edit':
      dialogTitle.value = '编辑隔离点房间'
      break
    default:
      break
  }
  
  dialogForm.value = true
}



const closeDialog = () => {
  // 置空
  //clearForm()
  dialogForm.value = false
}

// 编辑弹窗
const editIndustry = (row) => {
  //industryInfo.value = JSON.parse(JSON.stringify(row))
  
  dialogFlag.value = 'edit'
  openDialog('edit')
  dialogForm.value = true
}

const enterDialog = ( ) =>{
    dialogForm.value = false
}

//删除
const delclassify = async(row) => {
  ElMessageBox.confirm('此操作将永久删除该房间, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async() => {
      const res = await deletePlaceRoom(row)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--
        }
        getTableData()
      }
    })
}
</script>

<style scoped lang="scss">
</style> 