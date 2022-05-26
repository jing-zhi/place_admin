<template>
  <div>
    <div>
      <div class="gva-table-box" style="margin-bottom: 10px">
        <el-form ref="searchForm" :inline="true" :model="searchInfo">
          <el-form-item label="姓名" label-width="auto" prop="name">
            <el-input v-model="searchInfo.name" style="width:120px;" placeholder="姓名" />
          </el-form-item>
          <el-form-item
            label="证件号码"
            label-width="auto"
            prop="gzrsfz"
          >
            <el-input
              v-model="searchInfo.gzrsfz"
              placeholder="证件号码"
            />
          </el-form-item>
          <el-form-item label="手机号码" label-width="auto" prop="phone">
            <el-input v-model="searchInfo.phone" placeholder="手机号" />
          </el-form-item>
          <el-form-item label="场所名称" label-width="auto" prop="csmc">
            <el-input v-model="searchInfo.csmc" placeholder="场所名称" />
          </el-form-item>

          <el-form-item label="场所编号" label-width="auto" prop="csbh">
            <el-input v-model="searchInfo.csbh" placeholder="场所编号" />
          </el-form-item>
          <el-form-item
            label="体温范围"
            label-width="auto"
            prop="small_bodyTemperature"
          >
            <el-input
              v-model="searchInfo.small_bodyTemperature"
              style="width: 100px"
              placeholder="最低温度"
            />
            <span class="line" />

          </el-form-item>

          <el-form-item label-width="auto" prop="big_bodyTemperature">
            <el-input
              v-model="searchInfo.big_bodyTemperature"
              style="width: 100px"
              placeholder="最高温度"
            />
          </el-form-item>
          <el-form-item
            label="有效核酸"
            label-width="auto"
            prop="hasHsjl"
          >
            <el-select v-model="searchInfo.hasHsjl" style="width:120px;" placeholder="请选择">
              <el-option :value="0" label="无" />
              <el-option :value="1" label="有" />
            </el-select>
          </el-form-item>

          <el-form-item label="核酸结果" label-width="auto" prop="hsResult">
            <el-select v-model="searchInfo.hsResult" placeholder="请选择" style="width:120px;">
              <el-option value="阴性" label="阴性" />
              <el-option value="阳性" label="阳性" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="症状"
            label-width="auto"
            prop="symptomInformation"
          >
            <el-select
              v-model="searchInfo.symptomInformation"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in QSsymptomList"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="核酸时间范围" label-width="auto" prop="Time">
            <el-date-picker
              v-model="searchInfo.Time"
              clearable
              :default-time="defaultTime2"
              type="datetimerange"
              range-separator=":"
              :shortcuts="Qshortcuts"
              start-placeholder="核酸开始时间"
              end-placeholder="核酸结束时间"
              @change="timeScopeDiv"
            />
          </el-form-item>
          <el-form-item label="扫码时间范围" label-width="auto" prop="SMTime">
            <el-date-picker
              v-model="searchInfo.SMTime"
              :default-time="defaultTime2"
              type="datetimerange"
              range-separator=":"
              :shortcuts="Qshortcuts"
              start-placeholder="扫码开始时间"
              end-placeholder="扫码结束时间"
              @change="SMtimeScopeDiv"
            />
          </el-form-item>

          <div class="searchForm">
            <el-button
              size="small"
              type="primary"
              icon="search"
              @click="searchHandler"
            >查询</el-button>
            <el-button
              size="small"
              icon="refresh"
              @click="onReset"
            >重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <el-table :data="tableData" row-key="ID">
      <el-table-column
        align="center"
        label="扫码人姓名"
        min-width="120"
        prop="name"
      />
      <el-table-column
        align="center"
        label="扫码人身份证号"
        min-width="180"
        prop="documentNumber"
      />
      <el-table-column
        align="center"
        label="手机号"
        min-width="100"
        prop="phone"
      />
      <el-table-column
        align="center"
        label="物联码编号"
        min-width="120"
        prop="placeNumber"
      />
      <el-table-column
        align="center"
        label="扫码人体温"
        min-width="120"
        prop="bodyTemperature"
      />
      <el-table-column
        align="center"
        label="症状信息"
        min-width="120"
        prop="symptomInformation"
      />
      <el-table-column
        align="center"
        label="有效核酸记录"
        min-width="140"
        prop="hasHsjl"
      >
        <template #default="scope">
          {{ scope.row.hasHsjl === 0 ? "无" : "有" }}
        </template>
      </el-table-column>
      <!-- <el-table-column
          align="center"
          label="核酸规则"
          min-width="150"
          prop="sjhm"
        /> -->
      <el-table-column
        align="center"
        label="核酸时间"
        min-width="170"
        prop="hsTime"
      >
        <template #default="scope">
          {{
            scope.row.hsTime === "0001-01-01T00:00:00Z"||""
              ? ""
              : formatDate(scope.row.hsTime)
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="核酸结果"
        min-width="170"
        prop="hsResult"
      />
      <el-table-column
        align="center"
        label="扫码时间"
        min-width="160"
        prop="createdAt"
      >
        <template #default="scope">
          {{
            scope.row.createdAt === "0001-01-01T00:00:00Z"
              ? ""
              : formatDate(scope.row.createdAt)
          }}
        </template>
      </el-table-column>

      <!-- <el-table-column
          label="操作"
          min-width="150"
          fixed="right"
          v-if="renew"
        > -->
      <!-- <template #default="scope">
            <el-popover
            v-if="renew"
              trigger="click"
              v-model:visible="scope.row.visible"
              placement="top"
              width="160"
            >
              <p>确定要删除吗</p>
              <div style="text-align: right; margin-top: 8px">
                <el-button size="small" type="text" @click="cancel(scope.row)"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  @click="deletePlaceFun(scope.row)"
                  >确定</el-button
                >
              </div>
              <template #reference >
                <el-button type="text" icon="delete" size="small"
                  >删除</el-button
                >
              </template>
            </el-popover>
            <el-button
              type="text"
              icon="edit"
              size="small"
              @click="addOrUpdate(1, scope.row)"
              >编辑</el-button
            > -->
      <!-- </template>
        </el-table-column> -->
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
    <!--
      <addOrUpdateForm
        ref="addOrUpdateFormRef"
        :dialogFormVisible="dialogFormVisible"
        :dialogTitle="dialogTitle"
        :csbh ='csbh '

      /> -->
  </div>
</template>
<script>
export default {
  name: 'QuarantinedPersonSign',
}
</script>
<script setup>
import { getData } from '@/api/quarantinedPersonSign'
import { Qshortcuts } from '@/data/quarantined'
// import addOrUpdateForm from './components/addOrUpdate.vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, unref } from '@vue/reactivity'
import { nextTick, onMounted } from '@vue/runtime-core'
import { provide } from 'vue'
import { QSsearchList, QSsymptomList } from '@/data/quarantinedSign'
import { formatDate } from '@/utils/format'
// 表单数据
const searchInfo = reactive(QSsearchList)
const searchForm = ref()
const defaultTime2 = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
] // '12:00:00', '08:00:00'
const timeScopeDiv = () => {
  console.log(searchInfo.Time)
  searchInfo.start_hsTime = searchInfo.Time[0]
  searchInfo.end_hsTime = searchInfo.Time[1]
  // searchInfo.start_hsTime = Date.parse(searchInfo.start_hsTime)
  // searchInfo.end_hsTime = Date.parse(searchInfo.end_hsTime)
}
// 路由跳转拿到的数据
const route = useRoute()
const zjhm = route.params.zjhm ? route.params.zjhm : ''
// const csbh = route.params.csbh ? route.params.csbh :"";
console.log(
  zjhm,
  '拿到了路由跳转的人的zjhm',
  'route.params.cd_id',
  route.params
)
// 首页表格数据
const tableData = ref(null)
const dialogFormVisible = ref(false)
const dialogTitle = ref('')
// 新增修改实例
const addOrUpdateFormRef = ref()
const renew = ref(true)
// 分页和查询相关************
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const handleSizeChange = async(val) => {
  pageSize.value = val
  getTableData()
}
const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}
const clearData = () => {
  searchInfo.start_hsTime = ''
  searchInfo.end_hsTime = ''
  searchInfo.start_time = ''
  searchInfo.end_time = ''
}
const onReset = () => {
  clearData()
  searchForm.value.resetFields()
}
const getTableData = async() => {
  let Rcsbh = ''
  if (searchInfo.csbh !== '') {
    Rcsbh = searchInfo.csbh
  } else {
    Rcsbh = route.params.csbh
  }

  const searchList = JSON.parse(JSON.stringify(searchInfo))

  delete searchList.csbh
  delete searchList.Time
  delete searchList.SMTime
  const table = await getData({
    page: page.value,
    pageSize: pageSize.value,
    zjhm: route.params.zjhm ? route.params.zjhm : '',
    csbh: Rcsbh,
    ...searchList,
  })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}
const searchHandler = async() => {
  // 搜索
  if (searchInfo.small_bodyTemperature) {
    searchInfo.small_bodyTemperature = parseFloat(
      searchInfo.small_bodyTemperature
    )
  }
  if (searchInfo.big_bodyTemperature) { searchInfo.big_bodyTemperature = parseFloat(searchInfo.big_bodyTemperature) }
  if (searchInfo.small_bodyTemperature && searchInfo.big_bodyTemperature) {
    if (
      parseFloat(searchInfo.small_bodyTemperature) >=
      parseFloat(searchInfo.big_bodyTemperature)
    ) {
      ElMessage({
        message: '最低温度不得大于等于最高温度',
        type: 'warning',
      })
      return
    }
  }
  getTableData()
}
getTableData()
const SMtimeScopeDiv = () => {
  searchInfo.start_time = searchInfo.SMTime[0]
  searchInfo.end_time = searchInfo.SMTime[1]
  searchInfo.start_time = Date.parse(searchInfo.start_time)
  searchInfo.end_time = Date.parse(searchInfo.end_time)
}
</script>
<style scoped>
.searchForm {
  display: inline-flex;
  vertical-align: top;
}
.line{
  background-color: black;
  height: .9px;
  width: 10px;
  margin-left: 20px;
}
</style>
