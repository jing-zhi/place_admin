<template>
  <div>
    <div>
      <div class="gva-table-box" style="margin-bottom: 10px">
        <el-form ref="searchForm" :inline="true" :model="searchInfo">
          <el-form-item label="姓名" label-width="auto">
            <el-input v-model="searchInfo.glryxm" style="width:120px;" placeholder="姓名" />
          </el-form-item>
          <el-form-item label="人员类别">
            <el-select v-model="searchInfo.rylb" placeholder="请选择">
              <!--  -->
              <el-option
                v-for="(item, index) in rylbList"
                :key="index"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="国籍" label-width="auto">
            <el-select v-model="searchInfo.gj" placeholder="请选择" style="width:120px;">
              <el-option
                v-for="(item, index) in gjList"
                :key="index"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="隔离点房间编号" prop="gldfjbh">
            <el-select
              v-model="searchInfo.gldfjbh"
              :style="{ width: '80%' }"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roomList"
                :key="item.ID"
                :label="
                  item.BuildingNumber +
                    '栋' +
                    item.FloorNumber +
                    '层' +
                    item.RoomNumber +
                    '房间'
                "
                :value="item.ID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入境航班号" label-width="auto" prop="rjhbh">
            <el-input v-model="searchInfo.rjhbh" placeholder="入境航班号" />
          </el-form-item>
          <el-form-item label="身份证号" label-width="auto" prop="zjhm">
            <el-input v-model="searchInfo.zjhm" placeholder="身份证号" />
          </el-form-item>
          <el-form-item label="手机号码" label-width="auto" prop="sjhm">
            <el-input v-model="searchInfo.sjhm" placeholder="手机号码" />
          </el-form-item>
          <el-form-item label="场所编号" label-width="auto" prop="csbh">
            <el-input v-model="searchInfo.csbh" placeholder="场所编号" />
          </el-form-item>
          <el-form-item label="场所名称" label-width="auto" prop="csmc">
            <el-input v-model="searchInfo.csmc" placeholder="场所名称" />
          </el-form-item>

          <el-form-item label="隔离状态" label-width="auto" prop="glzt">
            <el-select v-model="searchInfo.glzt" placeholder="请选择" style="width:120px;">
              <el-option value="2" label="转运" />
              <el-option value="1" label="隔离" />
              <el-option value="3" label="结束隔离" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否接种疫苗" label-width="auto" prop="sfjzym">
            <el-select v-model="searchInfo.sfjzym" placeholder="请选择" style="width:120px;">
              <el-option value="2" label="未接种" />
              <el-option value="1" label="已接种" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否阳性" label-width="auto" prop="sfyz">
            <el-select v-model="searchInfo.sfyx" style="width:120px;" placeholder="请选择">
              <el-option value="2" label="否" />
              <el-option value="1" label="是" />
            </el-select>
          </el-form-item>
          <el-form-item label="隔离时间范围" label-width="auto" prop="glsj">
            <el-date-picker
              v-model="searchInfo.glsj"
              type="datetimerange"
              :default-time="defaultTime2"
              range-separator=":"
              :shortcuts="Qshortcuts"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="timeScopeDiv"
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
      <div class="gva-table-box" style="margin-bottom: 10px">
        <el-button
          size="small"
          type="primary"
          icon="plus"
          @click="addOrUpdate('0')"
        >新增隔离人员</el-button>
        <el-button
          size="small"
          type="primary"
          @click="exportData"
        ><span class="iconfont icon-shangchuan" /> 导出</el-button>
      </div>
    </div>
    <el-table :data="tableData" row-key="ID">
      <!-- <el-table-column align="center" label="记录ID" min-width="70" prop="cd_id" /> -->
      <el-table-column
        align="center"
        label="隔离人员姓名"
        min-width="120"
        prop="glryxm"
      />
      <el-table-column
        align="center"
        label="场所编号"
        min-width="230"
        prop="csbh"
      />
      <el-table-column
        align="center"
        label="场所名称"
        min-width="230"
        prop="csmc"
      />
      <el-table-column
        align="center"
        label="人员类别"
        min-width="100"
        prop="rylb"
      />
      <el-table-column
        align="center"
        label="是否非法入境人员"
        min-width="80"
        prop="sfffrjry"
      >
        <template #default="scope">
          {{ scope.row.sfffrjry === "1" ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="国籍" min-width="80" prop="gj" />
      <el-table-column
        align="center"
        label="证件类型"
        min-width="120"
        prop="zjlx"
      />
      <el-table-column
        align="center"
        label="证件号码"
        min-width="120"
        prop="zjhm"
      />
      <el-table-column
        align="center"
        label="手机号码"
        min-width="150"
        prop="sjhm"
      />
      <el-table-column
        align="center"
        label="入境航班编号"
        min-width="170"
        prop="rjhbh"
      />
      <el-table-column
        align="center"
        label="隔离点房间编号"
        min-width="170"
        prop="gldfjbh"
      >
        <template #default="scope">
          {{ scope.row.GLRoom.gldfjh }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="是否接种疫苗"
        min-width="150"
        prop="sfjzym"
      >
        <template #default="scope">
          {{ scope.row.sfjzym === "1" ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="是否阳性"
        min-width="120"
        prop="sfyx"
      >
        <template #default="scope">
          {{ scope.row.sfyx === "1" ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="隔离开始时间"
        min-width="160"
        prop="glkssj"
      >
        <template #default="scope">
          {{
            scope.row.glkssj === "0001-01-01T00:00:00Z"
              ? ""
              : formatDate(scope.row.glkssj)
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="隔离结束时间"
        min-width="160"
        prop="gljssj"
      >
        <template #default="scope">
          {{
            scope.row.gljssj.Time === "0001-01-01T00:00:00Z"
              ? ""
              : formatDate(scope.row.gljssj.Time)
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="隔离状态"
        min-width="120"
        prop="glzt"
      >
        <template #default="scope">
          {{
            scope.row.glzt === "1"
              ? "隔离"
              : scope.row.glzt === 2
                ? "转运"
                : "结束隔离"
          }}
        </template>
      </el-table-column>
      <el-table-column v-if="renew" label="操作" min-width="260" fixed="right">
        <template #default="scope">
          <el-popover
            :visible="scope.row.visible"
            trigger="click"
            placement="top"
            width="160"
          >
            <p>确定要删除吗</p>
            <div style="text-align: right; margin-top: 8px">
              <el-button
                size="small"
                type="text"
                @click="cancel(scope.row)"
              >取消</el-button>
              <el-button
                type="primary"
                size="small"
                @click="deletePlaceFun(scope.row)"
              >确定</el-button>
            </div>
            <template #reference>
              <el-button type="text" icon="delete" size="small">删除</el-button>
            </template>
          </el-popover>
          <el-button
            type="text"
            icon="edit"
            size="small"
            @click="addOrUpdate(1, scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            icon="edit"
            size="small"
            @click="lookOutSign(scope.row)"
          >查看扫码详情</el-button>
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

    <addOrUpdateForm
      ref="addOrUpdateFormRef"
      :dialog-form-visible="dialogFormVisible"
      :dialog-title="dialogTitle"
      :csbh="csbh"
    />
  </div>
</template>
<script>
export default {
  name: 'QuarantinedPersonManag',
}
</script>
<script setup>
import { formatDate } from '@/utils/format'
import {
  Qform,
  QrylbList,
  QgjList,
  QzjlxList,
  QcityList,
  QglztList,
  Qshortcuts,
  QsearchList,
} from '../../../data/quarantined'
import { useRoute, useRouter } from 'vue-router'
import addOrUpdateForm from './componments/addOrUpdate.vue'
import { formatTimeToStr } from '@/utils/date'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, unref } from '@vue/reactivity'
import {
  addData,
  getData,
  singleDelete,
  updateData,
  getRoomList,
  exportApi,
} from '@/api/quarantinedPersonManag'
import { nextTick } from '@vue/runtime-core'
import { provide } from 'vue'

const router = useRouter()
const route = useRoute()
const csbh = ref('')
csbh.value = route.params.csbh ? route.params.csbh : ''
const renew = ref(true) // 操作按钮刷新
const searchInfo = reactive(QsearchList)
const addOrUpdateFormRef = ref()
// 分页*********************
const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
// 查询列表项**********
const rylbList = QrylbList
const searchForm = ref()
const gjList = QgjList
const roomList = ref() // 房间
const defaultTime2 = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
] // '12:00:00', '08:00:00'
const handleSizeChange = async(val) => {
  pageSize.value = val
  getTableData()
}
const getRoom = async() => {
  const res = await getRoomList({ PlaceID: csbh.value, page: 1, pageSize: 999 })

  roomList.value = res.data.list
}
getRoom()
const timeScopeDiv = () => {
  searchInfo.start_time = searchInfo.glsj[0]
  searchInfo.end_time = searchInfo.glsj[1]
}
const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}
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

const onReset = () => {
  // 重置
  for (const key in searchInfo) {
    searchInfo[key] = ''
  }
}
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
const searchHandler = debounce(getTableData)
getTableData()

const exportData = debounce(() => {
  // 导出
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
// 页面中的操作******************************
const deletePlaceFun = (v) => {
  // 删除
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
    console.log("----------"+JSON.parse(JSON.stringify(row)));

  row.visible = false
  renew.value = false
  nextTick(() => {
    renew.value = true
  })
}
const lookOutSign = (v) => {
  // 查看
  router.push({
    name: 'quarantinedPersonSign',
    params: { zjhm: v.zjhm, csbh: v.csbh || route.params.csbh },
  })
}
// 弹框******************************
const dialogFormVisible = ref(false)
const dialogTitle = ref('')
const addOrUpdate = (v, data) => {
  // 新增或更改
  if (v == 0) {
    // 新增操作
    dialogTitle.value = '新增隔离人员信息'
    addOrUpdateFormRef.value.initForm(unref(roomList))
    dialogFormVisible.value = true
  } else {
    // 修改操作
    dialogTitle.value = '修改隔离人员信息'
    addOrUpdateFormRef.value.echoData(data, roomList)
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
.iconfont {
  margin-right: 5px;
  font-size: 12px;
}
</style>
