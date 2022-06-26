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
          <el-form-item label="场所名称" label-width="auto" prop="csmc">
            <el-input v-model="searchInfo.csmc" placeholder="场所名称" />
          </el-form-item>
          <el-form-item label="预计进入日期" label-width="auto" prop="expected_enter_day">
            <el-date-picker v-model="searchInfo.expected_enter_day" type="datetimerange" :default-time="defaultTime2"
              range-separator=":" :shortcuts="Qshortcuts" start-placeholder="开始时间" end-placeholder="结束时间" @change="timeScopeDiv"/>
            
          </el-form-item>
          <div class="searchForm">
            <el-button size="small" type="primary" icon="search" @click="searchHandler">查询</el-button>
            <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
          </div>
        </el-form>
      </div>
      <div class="gva-table-box" style="margin-bottom: 10px">
        <el-button size="small" type="primary" icon="plus" @click="addOrUpdate('0')">新增车辆报备记录</el-button>
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
      <el-table-column align="center" label="场所名称" min-width="120" prop="csmc" />
      <el-table-column align="center" label="预计进入日期" min-width="120" prop="expected_enter_day" />
      <el-table-column align="center" label="报备时间" min-width="180" prop="bbsj" />

      <el-table-column v-if="renew" label="操作" min-width="260" fixed="right">
        <template #default="scope">
          <el-popover :visible="scope.row.visible" trigger="click" placement="top" width="160">
            <p>确定要删除吗</p>
            <div style="text-align: right; margin-top: 8px">
              <el-button size="small" type="text" @click="cancel(scope.row)">取消</el-button>
              <el-button type="primary" size="small" @click="deletePlaceFun(scope.row)">确定</el-button>
            </div>
            <template #reference>
              <el-button type="text" icon="delete" size="small">删除</el-button>
            </template>
          </el-popover>
          <el-button type="text" icon="edit" size="small" @click="addOrUpdate(1, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="gva-pagination">
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]" :total="total"
        layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" />
    </div>
    <!-- @current-change="handleCurrentChange"
        @size-change="handleSizeChange" -->
    <!-- page-size	每页显示条目个数，
      page-sizes	每页显示个数选择器的选项设置
      current-page	当前页数，支持 .sync 修饰符
      layout	组件布局，子组件名用逗号分隔
      current-change	currentPage 改变时会触发
      size-change	pageSize 改变时会触发
       -->
      <addOrUpdateForm
      ref="addOrUpdateFormRef"
      :dialog-form-visible="dialogFormVisible"
      :dialog-title="dialogTitle"
    />
  </div>
</template>
<script>
export default {
  name: 'test'
}
</script>
<script setup>
import { ref, reactive, unref } from '@vue/reactivity'
import { vehicleList } from "@/data/vehicle.js"
import {
  addData,
  getData,
  singleDelete,
  updateData,
  exportApi,
} from '@/api/vehicleRecord'
import addOrUpdateForm from './componments/addOrUpdate.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { provide } from 'vue'

const page = ref(1)
const pageSize = ref(10)
const total = ref(2)
const csbh = ref('')
const searchInfo = reactive(vehicleList)
const tableData = ref([
    {
      people_name: '孙荐玺',
      phone_number: '17639331603',
      id_card: '411536200112053026',
      plate_number: '豫S123456',
      csmc: '新乡市红旗区',
      expected_enter_day: '2000/12/02',
      bbsj: '2000/12/02/12:36'
    },
    {
      people_name: '孙荐玺',
      phone_number: '17639331603',
      id_card: '411536200112053026',
      plate_number: '豫S123456',
      csmc: '新乡市红旗区',
      expected_enter_day: '2000/12/02',
      bbsj: '2000/12/02/12:36'
    },
])
const renew = ref(true) // 操作按钮刷新
const addOrUpdateFormRef = ref()

//获取表格数据
const getTableData = async() => {
  const searchList = JSON.parse(JSON.stringify(searchInfo))
  let Scsbh = ''
  if (searchInfo) {
    if (searchInfo.csbh !== '') {
      Scsbh = searchInfo.csbh
    } else {
      Scsbh = csbh.value
    }
  }
  delete searchList.csbh
  const table = await getData({
    page: page.value,
    pageSize: pageSize.value,
    ...searchList,
    csbh: Scsbh,
  })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
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
  searchInfo.start_time = searchInfo.glsj[0]
  searchInfo.end_time = searchInfo.glsj[1]
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
// getTableData()
// 导出数据
const exportData = debounce(() => {
  const searchList = JSON.parse(JSON.stringify(searchInfo))
  let Scsbh = ''
  if (searchInfo) {
    if (searchInfo.csbh !== '') {
      Scsbh = searchInfo.csbh
    } else {
      Scsbh = csbh.value
    }
  }
  if (searchList.start_time === '') delete searchList.start_time
  if (searchList.end_time === '') delete searchList.end_time
  delete searchList.csbh
  exportApi({
    fileName: 'glry_export.xlsx',
    ...searchList
  })
})

// 表格中的数据操作---------------------------------------
// 删除车辆信息记录
const deletePlaceFun = (v) => {
  ElMessageBox.confirm('确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async() => {
    const res = await singleDelete({ id: v.cd_id })
    if (tableData.length > 1 && page.value > 1) {
      page.value--
    }
    getTableData()
  })
}
const cancel = (row) => {
    // console.log("----------"+JSON.parse(JSON.stringify(row)));
  row.visible = false
  renew.value = false
  nextTick(() => {
    renew.value = true
  })
}

// 弹框******************************
// 新增或更改
const dialogFormVisible = ref(false)
const dialogTitle = ref('')
const addOrUpdate = (v, data) => {
  console.log(data);
  if (v == 0) {
    // 新增操作
    dialogTitle.value = '新增车辆信息记录'
    addOrUpdateFormRef.value.initForm(unref(vehicleList))
    dialogFormVisible.value = true
  } else {
    // 修改操作
    dialogTitle.value = '修改车辆信息记录'
    addOrUpdateFormRef.value.echoData(data, vehicleList)
    dialogFormVisible.value = true
  }
}
const dialogFormVisibleShow = () => {
  dialogFormVisible.value = false
}
const reGetData = () => {
  getTableData()
}
provide('dialogFormVisibleShow', dialogFormVisibleShow)
provide('reGetData', reGetData)
</script>

<style scoped>
.searchForm {
  display: inline-flex;
  vertical-align: top;
}
</style>