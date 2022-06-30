<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" style="margin-left:20px" :model="searchInfo">
        <el-form-item label="行业类别" prop>
          <el-select placeholder="请选择" size="large" v-model="searchInfo.industry">
            <el-option
              v-for="item in industryCate"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>
        <el-foem-item>
          <el-button class="excel-btn" size="small" type="primary" icon="download" @click="handleExcelExport">按条件导出</el-button>
        </el-foem-item>
      </el-form>
    </div>

    <div class="gva-table-box">
      <el-table :data="tableData">
        <el-table-column align="center" label="所属行业" min-width="120" prop="hy_name" />
        <el-table-column align="center" label="人员类别" min-width="120" prop="gldgw" />
        <el-table-column align="center" label="姓名" min-width="120" prop="gzryxm" />
        <el-table-column align="left" label="手机号" min-width="120" prop="gzrysjh">
          <template v-slot:="scope">
            <el-popover trigger="hover" placement="top">
              <span style="margin-left: 30px;">{{ scope.row.gzrysjh }}</span>
              <template #reference>
                <span>{{formatter(scope.row.gzrysjh,3,4) }}</span>
              </template>                   
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="核酸信息" min-width="120" prop="heSuanInfo" />
        <el-table-column align="center" label="健康码信息" min-width="120" prop="healthCode" />
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
    </div>
  </div>
</template>

<script setup>
import { ref,watch,toRaw} from "vue";
import {getBusinessMang} from "../../../api/place"
import { getTableList,getWorkerList ,exportExcel} from "../../../api/enterHenan"
import { debounce } from '@/utils/debounce.js'
import { formatDate,formatter } from '@/utils/format'

// 分页
const page = ref(1)
const pageSize = ref(10)
const total = ref()
const handleSizeChange = (val) => {
  pageSize.value = val
  // getTableData(searchInfo.value.industry)

}
const handleCurrentChange = (val) => {
  page.value = val
  // getTableData(searchInfo.value.industry)
}

const searchInfo = ref({
  industry:''
})

// 行业类型
const industryCate = ref([])

// 获取行业列表
const getBusinessList = async() => {
  const { data } = await getBusinessMang({ page:1,pageSize:34 }) 
  console.log(data.list);
  industryCate.value = data.list
  industryCate.value.unshift({ID:0,Name:'全部行业'})

}
getBusinessList()

 let is_14rhn = ref(null)

// 获取工作人员管理 中的 is_14rhn
const is_14rhnData = async(value) => {
  const rhnData = await getWorkerList({page:page.value, pageSize:pageSize.value})
  let data = rhnData.data.list
  for(let i = 0; i < data.length; i++){
    if(data[i].is_14rhn == true) {
      is_14rhn.value = data[i].is_14rhn
    }
 }
}

is_14rhnData()

let tableData = ref([])

// 获取表格数据
const getTableData = async(value) => {
   let query = { page:page.value, pageSize:pageSize.value}
  if(value){
    query = { page:page.value, pageSize:pageSize.value, hy_id:searchInfo.value.industry}
  }
  const table = await getTableList(query)
  if(table.code === 0){
    tableData.value = table.data.cdIs14Rhn
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}
getTableData()

// 获取搜索列表
const getFind = () => {
  getTableData(searchInfo.value.industry)
}
getFind()

watch(searchInfo.value,(newVal,oldVal) => {
   getFind()
},{immediate:true})

  // 导出
const handleExcelExport = debounce(() => {
    exportExcel({ file_name:'ehPerson_export.xlsx', is_14rhn:is_14rhn.value, hy_id:Number(searchInfo.value.industry)})
})

const getExcel = () => {
}


</script>

<style scoped>
.excel-btn {
  margin-left: 10px;
  margin-bottom: 18px;
}
.Editbtn{
  margin-left: 10px;
}
.tip{
  margin: 5px auto;
}
</style>