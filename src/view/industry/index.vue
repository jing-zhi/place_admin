<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item  label="宿舍楼名称">
            <el-input v-model="searchInfo.Name"  placeholder="宿舍楼名称"></el-input>
        </el-form-item>
        <el-form-item label="处理有效时间">
            <!-- <el-input v-model="searchInfo.HesuanTime" placeholder="有效核酸时间"></el-input> -->
            <el-select v-model="searchInfo.HesuanTime" class="m-2" placeholder="有效核酸时间" size="large">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addIndustry(add)"
        :hidden="userStore.userInfo.authorities[0].authorityName === '场所管理员'"
        >新增</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <!-- <el-table-column align="left" label="ID" min-width="70" prop="id" /> -->
        <el-table-column align="left" label="宿舍楼名称" min-width="230"  prop="Name" />
        <el-table-column align="left" label="处理有效时间" min-width="100" prop="HesuanTime" show-overflow-tooltip />
        <el-table-column label="操作" min-width="130" fixed="right">
          <template #default="scope">
            <el-button type="text" icon="edit" size="small" @click="editIndustry(scope.row)">编辑</el-button>
            <el-button type="text" icon="delete" size="small" @click="delIndustry(scope.row)">删除</el-button>
            <el-button type="text" icon="Share" size="small" @click="classifyPeople(scope.row)">人员类别</el-button>
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

      <el-dialog
        v-model="addDialog"
        custom-class="user-dialog"
        title="行业管理"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div style="height:60vh;overflow:auto;padding:0 10px;">
          <el-form ref="industryForm" :rules="rules" :model="industryInfo" label-width="180px" style="width:80%">
            <el-form-item label="宿舍楼名称" prop="Name" v-if="showIndustryName">
              <el-input v-model="industryInfo.Name" style="width:227px;" disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="宿舍楼名称" prop="Name" v-else>
              <el-input v-model="industryInfo.Name" style="width:227px;"></el-input>
            </el-form-item>
            <el-form-item label="处理有效时间" prop="HesuanTime">
              <el-select v-model="industryInfo.HesuanTime" class="m-2" placeholder="请选择" size="large">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>

          </el-form>

        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button size="small" @click="closeAddDialog">取 消</el-button>
            <el-button size="small" type="primary" @click="enterAddDialog">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'industry',
}
</script>

<script setup>
import { getIndustryList, setIndustry,addIndustryName,deleteIndustry } from '@/api/industry.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { nextTick, ref, watch ,toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../pinia/modules/user'

const userStore = useUserStore()
// console.log(userStore.userInfo.authorities[0].authorityName);

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchindustry = ref({})

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  //console.log(val)
  getTableData()
}

// 搜索
const searchInfo = ref({})
const onSearch =()=> {
  page.value = 1
  pageSize.value = 10
  // console.log(searchInfo.value);
  getTableData(searchInfo.value)
}

// 删除
const delIndustry = async(row) => {
   ElMessageBox.confirm('此操作将永久删除该信息, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async()=>{
    console.log("row.id:",row,row.ID);
    const res = await deleteIndustry({id:row.ID})
    console.log(res);
    if(res.code === 0){
      ElMessage({
          type: 'success',
          message: '删除成功!',
        })
      getTableData()
    }
  })
}



// 查询
const getTableData = async(value) => {
    let rqt = { page: page.value, pageSize: pageSize.value }
    if(value) {
        rqt = { page: page.value, pageSize: pageSize.value, ...value }
    }
    //console.log(rqt);
  const table = await getIndustryList(rqt)
  if (table.code === 0) {
    // console.log(table)
    tableData.value = table.data.list
    console.log(table.data);
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

// 行业类型
const options = [
  { label: '24小时', value: 24 },
  { label: '48小时', value: 48 },
  { label: '72小时', value: 72 },
]

const initPage = async() => {
  getTableData()
}

initPage()


// 弹窗
const addDialog = ref(false)
const closeAddDialog = () => {
  // 置空
  clearForm()
  addDialog.value = false
}
const clearForm = () => {
  industryForm.value.resetFields()
  industryInfo.value = {
    'HesuanTime': '',
  }
}

const dialogFlag = ref('add')

// 新增
const addIndustry = () => {
  dialogFlag.value = 'add'
  addDialog.value = true
}

// 弹窗
const industryInfo = ref({
  'HesuanTime': '',
  'Name':''
})
const rules = ref({
  HesuanTime:[
    { required: true, message: '请选择核酸时间' },
  ],
  Name:[
    { required: true, message: '请输入宿舍楼名称' },
  ]
})

const industryForm = ref(null)

let showIndustryName = ref(false)

// 修改
const editIndustry = (row) => {
  industryInfo.value = JSON.parse(JSON.stringify(row))
  showIndustryName.value = true
  dialogFlag.value = 'edit'
  addDialog.value = true
}

// 确认增加修改
const enterAddDialog = async() => {
  industryForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...industryInfo.value,
      }
      // console.log("industryInfo.value:",req)
      let ret = {
          ID:req.ID,
          HesuanTime:req.HesuanTime,
          Name:req.Name
      }
      //console.log(ret)
      // 新增
      if (dialogFlag.value === 'add') {
        //console.log('add')
        const res = await addIndustryName(ret)
        if(res.code === 0){
          ElMessage({type:'success',message:'添加成功'})
          await getTableData()
          closeAddDialog()
        }
      }
      // 修改
      if (dialogFlag.value === 'edit') {
        //console.log('edit')
        const res = await setIndustry(ret)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddDialog()
        }
      }

    }
  })

}

// 人员类别跳转
const router = useRouter()
// 跳转工作人员管理
const classifyPeople = (row) => {
  router.push({
    name: 'Category',
    params: {
      'ID': row.ID,
      'sectorName': row.Name

    }
  })


}



</script>

<style lang="scss">


</style>
