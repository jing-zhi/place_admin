<template>
  <div>
    <div class="gva-search-box">
        <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="所属行业">
          <el-select v-model="searchInfo.hy_name" class="m-2" placeholder="所属行业" size="large">
            <el-option
              v-for="item in industryList"
              :key="item.Name"
              :label="item.Name"
              :value="item.Name"
              @click="changeId(item)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="人员类别">
          <el-input v-model="searchInfo.rylb_name" placeholder="人员类别" />
        </el-form-item>
        <!-- <el-form-item label="核酸规则">
          <el-select v-model="searchInfo.State" class="m-2" placeholder="核酸规则信息" size="large">
            <el-option
              v-for="item in healthCode"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item> -->

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
              icon="Delete"
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

      <el-dialog v-model="dialogForm" :before-close="closeDialog" :title="dialogTitle" width="30%">
        <el-form ref="apiForm" :model="form" :rules="rules" label-width="120px" style="width:80%">
            <el-form-item label="所属行业" prop="hy_name">
            <el-input v-model="form.hy_name"  disabled autocomplete="off" />
            </el-form-item>
            <el-form-item label="人员类别" prop="rylb_name">
            <el-input v-model="form.rylb_name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="核酸时间" prop="hesuan_time">
              <el-select v-model="form.hesuan_time" class="m-2" placeholder="请选择" size="large" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
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
import { getCategory, createPelop,deletePlaceRoom,updataPelop} from '@/api/Category.js'
import { useRoute, useRouter } from 'vue-router'
import { getIndustryList, setIndustry } from '@/api/industry.js'

const route = useRoute()
// hyid
const ID = ref('')
ID.value = route.params.ID ? route.params.ID : ''
const sectorName = ref('')
sectorName.value = route.params.sectorName ? route.params.sectorName : ''

const tableData = ref([])
const searchInfo = ref({})
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)

const apiForm =ref(null)
// const hyName =ref('')
// hyName = searchInfo.value.hy_name
//tableData.value = []
const form = ref({
  hy_name: '',
  rylb_name: '',
  hesuan_time: '',

})

const type = ref('')
const rules = ref({

  rylb_name: [
    { required: true, message: '请输入人员类别', trigger: 'blur' },
  ],
 hesuan_time: [
    { required: true, message: '请输入核酸时间', trigger: 'blur' },
  ]

})


const options = [
  { label: '24小时', value: 24 },
  { label: '48小时', value: 48 },
  { label: '72小时', value: 72 },
]

// 重置按钮
const onReset = () => {
  searchInfo.value = {}
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}
// 搜索查询
const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData(searchInfo.value)
  
}



// 分页渲染
const getTableData = async(value) => {
    let rqt = { page: page.value, pageSize: pageSize.value, hy_id: Number(ID.value) }
    if(value) {
        rqt = { page: page.value, pageSize: pageSize.value, hy_id: Number(ID.value) , ...value }   
    } 
   // console.log(rqt);
  const table = await getCategory(rqt)
  if (table.code === 0) {
   // console.log(table)
    tableData.value = table.data.rylb
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

// 查询所有行业名称+id
const industryList = ref([])
const getIndustry = async() => {
  let rqt = { page: 1, pageSize: 100 } 
  //console.log(rqt);
  const table = await getIndustryList(rqt)
  if (table.code === 0) {
    // console.log(table)
    industryList.value = table.data.list
  }
}

const changeId = (item) =>{
  ID.value = item.ID
  form.value.hy_name = item.Name
  //console.log(ID.value);
}

const initPage = async() => {
  getIndustry()
  // 获取行业名字+id
  getTableData()
  // 下拉框数据重定向
  searchInfo.value.hy_name = sectorName.value
  form.value.hy_name = searchInfo.value.hy_name

}

initPage()


// 增加弹窗
const dialogTitle = ref('新增人员类别')
const dialogForm = ref(false)
const dialogFlag = ref('add')
const openDialog = (key) => {
  switch (key) {
    case 'add':
        dialogFlag.value = 'add'
        dialogForm.value = true
        dialogTitle.value = '新增人员类别'
      break
    case 'edit':
      dialogTitle.value = '编辑人员类别'
      break
    default:
      break

  }
  dialogForm.value = true
}



const closeDialog = () => {
  // 置空
  initForm()
  dialogForm.value = false
}
                               
// 弹窗相关
// const apiForm = ref(null)
const initForm = () => {
  apiForm.value.resetFields()

}
const editId = ref('')
// 编辑弹窗
const editIndustry = (row) => {
  form.value = JSON.parse(JSON.stringify(row)) 
 // from.value
  //console.log(row);
  editId.value = row.id
  openDialog('edit')
  dialogFlag.value = 'edit'
  dialogForm.value = true
}

 
//  确定
const enterDialog = async() => {
  apiForm.value.validate(async valid => {
    if (valid) {  
      switch (dialogFlag.value) {
        case 'add': {
          //console.log(ID);
          form.value.hy_id = Number(ID.value)
          const res = await createPelop(form.value)
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '添加成功',
              showClose: true,
            })
          }
          getTableData()
          closeDialog()
        }
          break
        case 'edit': {
          form.value.id = editId.value
          const res = await updataPelop(form.value)
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '编辑成功',
              showClose: true,
            })
          }
          getTableData()
          closeDialog()
        }
          break
        default:
          {
            ElMessage({
              type: 'error',
              message: '未知操作',
              showClose: true,
            })
          }
          break
      }
    }
  })
}

//删除
const delclassify = async(row) => {
  //console.log(row,"row")
  ElMessageBox.confirm('此操作将永久删除该信息, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async() => {
      const res = await deletePlaceRoom({ id: row.id })
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        // if (tableData.value.length === 1 && page.value > 1) {
        //   page.value--
        // }
        getTableData()
      }
    })
}
</script>

<style scoped lang="scss">

</style> 