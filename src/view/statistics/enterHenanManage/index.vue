<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" style="margin-left:20px" :model="searchInfo">
        <el-form-item label="行业类别" prop>
          <el-select placeholder="请选择" size="large" v-model="searchInfo.industry">
            <el-option
              v-for="(item,index) in industryCate"
              :key="index"
              :label="item"
              :value="item"
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
        <el-table-column align="left" label="所属行业" min-width="120" prop="industry" />
        <el-table-column align="left" label="人员类别" min-width="120" prop="PerCate" />
        <el-table-column align="left" label="姓名" min-width="120" prop="EHPname" />
        <el-table-column align="left" label="手机号" min-width="120" prop="EHPphone" />
        <el-table-column align="left" label="核酸信息" min-width="120" prop="NacidInfo" />
        <el-table-column align="left" label="健康码信息" min-width="120" prop="HcodeInfo" />
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
import { reactive, ref, toRefs ,watch} from "vue";
import { exportExcel } from "../../../api/enterHenan";


// 分页
const page = ref(5)
const pageSize = ref(100)
const total = ref(400)
const handleSizeChange = (val) => {
  pageSize.value = val

}
const handleCurrentChange = (val) => {
page.value = val
}

const isSearch = ref(false)
const searchInfo = ref({})
const industryCate = ref([
  '农机车辆','隔离点','医废运输处理公司','高速服务区等机构工作人员','药店','相关行政部门','出租汽车'
])
// 搜索
const getTableData = async(value) => {
console.log(111);
console.log(value);
}

watch(searchInfo.value,(newVal,oldVal) => {
  console.log("watch:",searchInfo.value);
  getTableData(searchInfo.value)
},{immediate:true})

/* 
const tableData = [
  {
    industry: "教育",
    PerCate: "学生",
    EHPname: "叮叮",
    EHPphone: "13526224242",
    NacidInfo: "正常",
    HcodeInfo: "绿码"
  },
  {
    industry: "教育",
    PerCate: "学生",
    EHPname: "叮叮",
    EHPphone: "13526224242",
    NacidInfo: "正常",
    HcodeInfo: "绿码"
  }
]; */


 const tableData = ref([
    {
      industry:'教育',  
      PerCate:'学生',   
      EHPname:'叮叮',  
      EHPphone:'13526224242', 
      NacidInfo:'正常', 
      HcodeInfo:'绿码'  
    },
    {
      industry:'教育',  
      PerCate:'学生',   
      EHPname:'叮叮',  
      EHPphone:'13526224242', 
      NacidInfo:'正常', 
      HcodeInfo:'绿码'  
    }
  ])

  // 导出
// 导出数据有问题 ！！
const handleExcelExport = () => {
  const titleArr = ['所属行业','人员类别','姓名','手机号','核酸信息','健康码信息']//表头中文名
exportExcel(tableData.value, '14天内入豫人员信息', titleArr, 'sheetName');
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