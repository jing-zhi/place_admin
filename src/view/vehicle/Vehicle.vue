<template>
  <div>
    <div>
      <div class="gva-table-box" style="margin-bottom: 10px">
        <el-form ref="searchForm" :inline="true" :model="searchInfo">
          <el-form-item label="姓名" label-width="auto">
            <el-input v-model="searchInfo.people_name" style="width:120px;" placeholder="姓名" prop="people_name" />
          </el-form-item>
          <el-form-item label="手机号码" label-width="auto" prop="phone_number">
            <el-input v-model="searchInfo.phone_number" placeholder="手机号码" />
          </el-form-item>
          <el-form-item label="身份证号" label-width="auto" prop="id_card">
            <el-input v-model="searchInfo.id_card" placeholder="身份证号" />
          </el-form-item>
          <el-form-item label="车牌号" label-width="auto" prop="plate_number">
            <el-input v-model="searchInfo.plate_number" placeholder="车牌号" />
          </el-form-item>
          <el-form-item label="场所名称" label-width="auto" prop="place_name">
            <el-input v-model="searchInfo.place_name" placeholder="场所名称" />
          </el-form-item>
          <el-form-item label="预计进入日期" label-width="auto" prop="glsj">
            <el-date-picker v-model="searchInfo.glsj" type="datetimerange" :default-time="defaultTime2"
              range-separator=":" :shortcuts="Qshortcuts" start-placeholder="开始时间" end-placeholder="结束时间" @change="timeScopeDiv"/>           
          </el-form-item>
          <div class="searchForm">
            <el-button size="small" type="primary" icon="search" @click="searchHandler">查询</el-button>
            <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
          </div>
        </el-form>
      </div>
      <div class="gva-table-box" style="margin-bottom: 10px">
        <el-button size="small" type="primary" @click="exportData">
          <span class="iconfont icon-shangchuan" /> 导出
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" row-key="ID">
      <!-- <el-table-column align="center" label="记录ID" min-width="70" prop="cd_id" /> -->
      <el-table-column align="center" label="姓名" min-width="120" prop="people_name" />
      <el-table-column align="center" label="手机号码" min-width="120" prop="phone_number" />
      <el-table-column align="center" label="身份证号码" min-width="230" prop="id_card" />
      <el-table-column align="center" label="车牌号" min-width="120" prop="plate_number" />
      <el-table-column align="center" label="场所名称" min-width="120" prop="place_name" />
      <el-table-column align="center" label="预计进入日期" min-width="120" prop="expected_enter_day_fmt" />
      <el-table-column align="center" label="报备时间" min-width="180" prop="record_time" />
    </el-table>
    <div class="gva-pagination">
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]" :total="total"
        layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'test'
}
</script>
<script setup>
import { ref, reactive } from '@vue/reactivity'
import { vehicleList} from "@/data/vehicle.js"
import {
  getData,
  exportApi,
} from '@/api/vehicleRecord'

const page = ref(1)
const pageSize = ref(10)
const total = ref(2)
const searchInfo = reactive(vehicleList)
const tableData = ref([
    {
      people_name: '孙荐玺',
      phone_number: '17639331603',
      id_card: '411536200112053026',
      plate_number: '豫S123456',
      place_name: '新乡市红旗区',
      expected_enter_day_fmt: '2000/12/02',
      record_time: '2000/12/02/12:36'
    },
    {
      people_name: '孙荐玺',
      phone_number: '17639331603',
      id_card: '411536200112053026',
      plate_number: '豫S123456',
      place_name: '新乡市红旗区',
      expected_enter_day_fmt: '2000/12/02',
      record_time: '2000/12/02/12:36'
    },
    {
      people_name: '孙荐玺',
      phone_number: '17639331603',
      id_card: '411536200112053026',
      plate_number: '豫S123456',
      place_name: '新乡市红旗区',
      expected_enter_day_fmt: '2000/12/02',
      record_time: '2000/12/02/12:36'
    },
    
])

//获取表格数据
const getTableData = async() => {
  const searchList = JSON.parse(JSON.stringify(searchInfo))
  console.log(searchList);
  console.log(page.value);
  console.log(pageSize.value);
  const table = await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchList,
  })
  console.log(table);
  if (table.code == 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    // page.value = table.data.page
    // pageSize.value = table.data.pageSize
  }else{
    console.log("请求失败");
  }
}
//防抖函数
const debounce = (fn, wait = 500) => {
  let timer = null
  const that = this
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.call(that, args)
    }, wait)
  }
}
//时间范围挑选
const timeScopeDiv = () => {
  searchInfo.expected_enter_day_start = searchInfo.glsj[0]
  searchInfo.expected_enter_day_end = searchInfo.glsj[1]
}


//页面上方与下方的查询与分页 -------------------------------------
// 重置
const onReset = () => {
  for (const key in searchInfo) {
    searchInfo[key] = ''
  }
}
// 分页方法
const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}
const handleSizeChange = async(val) => {
  pageSize.value = val
  getTableData()
}
// 查询
const searchHandler = debounce(getTableData)
// 获取渲染表格数据
getTableData()
// 导出数据
const exportData = debounce(() => {
  const searchList = JSON.parse(JSON.stringify(searchInfo))
  
  if (searchList.start_time === '') delete searchList.start_time
  if (searchList.end_time === '') delete searchList.end_time
  delete searchList.csbh
  exportApi({
    fileName: 'glry_export.xlsx',
    ...searchList
  })
})



</script>

<style scoped>
.searchForm {
  display: inline-flex;
  vertical-align: top;
}
</style>