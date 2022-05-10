<template>
  <div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button class="excel-btn" size="small" type="primary" icon="plus" @click="addPlace">新增</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <!-- <el-table-column align="left" label="记录ID" min-width="70" prop="cd_id" /> -->
        <el-table-column align="left" label="场所编号" min-width="230" prop="csbh" />
        <el-table-column align="left" label="场所名称" min-width="100" prop="csmc" show-overflow-tooltip />
        <el-table-column align="left" label="行业类型" min-width="120" prop="hylx_name" />
        <el-table-column align="left" label="所属区县" min-width="80" prop="qx_name" show-overflow-tooltip />
        <el-table-column align="left" label="所属乡镇" min-width="90" prop="sq_name" show-overflow-tooltip />
        <el-table-column align="left" label="所属村" min-width="120" prop="jd_name" show-overflow-tooltip />
        <el-table-column align="left" label="详细地址" min-width="150" prop="xxdz" show-overflow-tooltip />
        <el-table-column align="left" label="启用状态" min-width="80" prop="qyzt">
          <template #default="scope">
            <el-switch
              v-model="scope.row.qyzt"
              :active-value="1"
              :inactive-value="0"
              @click="switchChange(scope.row)"
            />
          </template>

        </el-table-column>
        <!-- <el-table-column align="left" label="经度" min-width="80" prop="gldjd" />
        <el-table-column align="left" label="纬度" min-width="80" prop="gldwd" /> -->
        <el-table-column align="left" label="负责人姓名" min-width="100" prop="fzrxm" />
        <el-table-column align="left" label="负责人电话" min-width="120" prop="fzrdh" />
        <el-table-column align="left" label="负责人身份证" min-width="170" prop="fzrsfz" />
        <el-table-column align="left" label="申领单位" min-width="150" prop="fzrgzdw" show-overflow-tooltip />
        <el-table-column align="left" label="申领时间" min-width="220" prop="slsj" />
        
        <el-table-column label="操作" min-width="130" fixed="right">
          <template #default="scope">
            <el-popover v-model:visible="scope.row.visible" placement="top" width="160">
              <p>确定要删除吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="deletePlaceFun(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button type="text" icon="delete" size="small">删除</el-button>
              </template>
            </el-popover>
            <el-button type="text" icon="edit" size="small" @click="editPlace(scope.row)">编辑</el-button>
            <el-button type="text" icon="edit" size="small" @click="enterWorker(scope.row)">工作人员管理</el-button>
            <el-button :hidden="scope.row.hylx_name !== '隔离点'" type="text" icon="edit" size="small" @click="enterPeople(scope.row)">隔离人员管理</el-button>
            <el-button :hidden="scope.row.hylx_name !== '隔离点'" type="text" icon="edit" size="small" @click="editPlaceRoome(scope.row)">房间管理</el-button>
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
        title="场地管理"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div style="height:60vh;overflow:auto;padding:0 10px;">
          <el-form ref="placeForm" :rules="rules" :model="placeInfo" label-width="110px">
            <el-form-item label="行业类型" prop="hylx_name">
              <el-select v-model="placeInfo.hylx_name" class="m-2" placeholder="请选择行业类型" size="large">
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.label"
                  :value="item.label"
                  @click="hylxSelect(item)"
                />
              </el-select>
              <!-- <el-input v-model="placeInfo.hylx" /> -->
            </el-form-item>
            <el-form-item label="场所名称" prop="csmc">
              <el-input v-model="placeInfo.csmc" />
            </el-form-item>
            <!-- 下拉框 -->
            
            <!-- <el-form-item label="所属村" prop="jd_name">
              <el-input v-model="placeInfo.jd" />
            </el-form-item> -->

            <!-- <el-form-item label="区/街道">
              <el-cascader
                ref="qx"
                v-model="value"
                :options="res"
                @change="handleChange"
              />
            </el-form-item> -->
            <el-form-item label="所属区县" prop="qx">
              <el-select v-model="placeInfo.qx" class="m-2" placeholder="请选择" size="large">
                <el-option
                  v-for="item in qxList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  @click="qxSelect(item)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属乡镇" prop="sq">
              <el-select v-model="placeInfo.sq" class="m-2" placeholder="请选择" size="large">
                <el-option
                  v-for="item in xzList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  @click="xzSelect(item)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属村" prop="jd">
              <el-select v-model="placeInfo.jd" class="m-2" placeholder="请选择" size="large">
                <el-option
                  v-for="item in cunList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  @click="cunSelect(item)"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="详细地址" prop="xxdz">
              <el-input v-model="placeInfo.xxdz" />
            </el-form-item>
            <el-form-item label="负责人姓名" prop="fzrxm">
              <el-input v-model="placeInfo.fzrxm" />
            </el-form-item>
            <el-form-item label="负责人电话" prop="fzrdh">
              <el-input v-model="placeInfo.fzrdh" />
            </el-form-item>
            <el-form-item label="负责人身份证" prop="fzrsfz">
              <el-input v-model="placeInfo.fzrsfz" />
            </el-form-item>
            <el-form-item label="申领单位" prop="fzrgzdw">
              <el-input v-model="placeInfo.fzrgzdw" />
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
  name: 'Place',
}
</script>

<script setup>

import { nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getPlaceList, setStatus, createPlace, setPlace, deletePlace } from '@/api/place.js'
import json from '@/utils/address/xinxiang.json'
import vlgs from '@/utils/address/villages.json'
import { useRouter } from 'vue-router'

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
// 区和街道
const res = ref([])
const areaValue = ref()
const streetValue = ref()
const qxList = ref([])
const xzList = ref([])
const cunList = ref([])
const hylx = ref()
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

// 查询
const getTableData = async() => {
  // console.log({ page: page.value, pageSize: pageSize.value });
  const table = await getPlaceList({ page: page.value, pageSize: pageSize.value })
  if (table.code === 0) {
    // console.log(table)
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

// 行业类型
const options = [
  { label: '隔离点', code: 43 },
  { label: '体育场馆', code: 8 },
  { label: '奶茶店', code: 9 },
  { label: '居家', code: 10 },
  { label: '写字楼，办公场所', code: 11 },
  { label: '宾馆', code: 12 },
  { label: '商场和超市', code: 13 },
  { label: '银行', code: 14 },
  { label: '餐厅', code: 15 },
  { label: '理发店', code: 16 },
  { label: '农集贸市场', code: 17 },
  { label: '公园', code: 18 },
  { label: '旅游景点', code: 19 },
  { label: '健身场所', code: 20 },
  { label: '咖啡吧、酒吧、茶座', code: 21 },
  { label: '影剧院', code: 22 },
  { label: '游泳场所', code: 23 },
  { label: '会展中心', code: 24 },
  { label: '游艺游乐场所和上网服务场所', code: 25 },
  { label: '展览馆、博物馆、美术馆', code: 26 },
  { label: '图书馆', code: 27 },
  { label: '歌舞娱乐场所', code: 28 },
  { label: '公共浴室', code: 29 },
  { label: '医疗机构', code: 30 },
  { label: '道路客运', code: 32 },
  { label: '城市公共汽电车', code: 35 },
  { label: '出租汽车', code: 37 },
  { label: '相关行政部门', code: 39 },
  { label: '药店', code: 40 },
  { label: '高速服务区等机构工作人员、生产车间', code: 41 },
  { label: '医废运输处理公司', code: 42 },
]

const getRes = async() => {
  // console.log(json.children)
  const test = json.children
  var ans = []
  var children = []
  for (let i = 0; i < test.length; i++) {
    for (let j = 0; j < test[i].children.length; j++) {
      children[j] = { 'value': test[i].children[j].code, 'label': test[i].children[j].name }
    }
    ans[i] = { 'value': test[i].code, 'label': test[i].name, 'children': children }
    children = []
  }
  res.value = ans
  //console.log(ans)
}

const initPage = async() => {
  getTableData()
  //getRes()
  qxList.value = json.children
}

initPage()

const switchChange = async(row) => {
  console.log({ id: row.id, status: row.qyzt })
  const resStatus = await setStatus({ id: row.id, status: row.qyzt })
  if (resStatus.code === 0) {
    console.log(resStatus)
    ElMessage.success('修改成功')
  }
}
// 弹窗
const addDialog = ref(false)
const closeAddDialog = () => {
  // 置空
  clearForm()
  addDialog.value = false
}
const clearForm = () => {
  placeForm.value.resetFields()
  placeInfo.value = {
    'csmc': '',
    'qx': '',
    'qx_name': '',
    'sq': '',
    'sq_name': '',
    'jd': '',
    'jd_name': '',
    'xxdz': '',
    'qyzt': 0,
    'gldjd': '',
    'gldwd': '',
    'fzrxm': '',
    'fzrdh': '',
    'fzrsfz': '',
    'fzrgzdw': '',
    'hylx_name': '',
    'hylx': null,
  }
}

const dialogFlag = ref('add')

// 新增
const addPlace = () => {
  dialogFlag.value = 'add'
  addDialog.value = true
}
// 删除
const deletePlaceFun = async(row) => {
  console.log(row.id)
  const res = await deletePlace({ id: row.id })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}

// 弹窗
const placeInfo = ref({
  'csmc': '',
  'qx': '',
  'qx_name': '',
  'sq': '',
  'sq_name': '',
  'jd': '',
  'jd_name': '',
  'xxdz': '',
  'qyzt': 0,
  'gldjd': '',
  'gldwd': '',
  'fzrxm': '',
  'fzrdh': '',
  'fzrsfz': '',
  'fzrgzdw': '',
  'hylx_name': '',
  'hylx': null,
})
const rules = ref({
  csmc: [
    { required: true, message: '请输入场合名称', trigger: 'blur' },
  ],
  xxdz: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
  ],
  fzrxm: [
    { required: true, message: '请输入负责人姓名', trigger: 'blur' },
    { min: 1, max: 5, message: '不合要求', trigger: 'blur' },
  ],
  fzrdh: [
    { required: true, message: '请输入负责人电话', trigger: 'blur' },
    // 正则
     { pattern: /^1(3|4|5|7|8|9)\d{9}$/,
        message: '手机号不合法' ,
        trigger: 'blur'}
  ],
  fzrsfz: [
    { required: true, message: '请输入负责人身份证', trigger: 'blur' },
    // 正则
    { pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
        message: '身份证号不合法' ,
        trigger: 'blur'}
  ],
  fzrgzdw: [
    { required: true, message: '请输入申领单位', trigger: 'blur' },
    // { min: 2, message: '最低2位字符', trigger: 'blur' },
  ],
  hylx_name: [
    { required: true, message: '请选择行业类型' },
  ],
  qx:[
    { required: true, message: '请选择区县' },
  ],
  sq:[
    { required: true, message: '请选择乡镇' },
  ],
  jd:[
    { required: true, message: '请选择该项' },
  ],
})

const placeForm = ref(null)

// 修改
const editPlace = (row) => {
  placeInfo.value = JSON.parse(JSON.stringify(row))
  //placeInfo.value.qx_name = row.qx_name
  getXzList(row.qx)
  //placeInfo.value.sq_name = row.sq_name
  getCunList(row.sq)
  //placeInfo.value.jd_name = row.jd_name
  qx_name.value = row.qx_name
  sq_name.value = row.sq_name
  jd_name.value = row.jd_name
  hylx.value = Number(row.hylx)
  //console.log(placeInfo.value);
  dialogFlag.value = 'edit'
  addDialog.value = true
}

const router = useRouter()
// 跳转工作人员管理
const enterWorker = (row) => {
  router.push({
    name: 'worker',
    params: {
      'csbh': row.csbh
    }
  })
}
//跳转隔离人员管理
const enterPeople = (row) => {
  router.push({
    name: 'quarantinedPersonManag',
    params: {
      'csbh': row.csbh
    }
  })
}

// 跳转房间管理
const editPlaceRoome = (row) => {
  router.push({
    name: 'placeRoom',
    params: {
      'PlaceID': row.csbh
    }
  })
}

// 确认增加修改
const enterAddDialog = async() => {
  placeForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...placeInfo.value,
      }     
      req.hylx = hylx.value
      req.qx_name = qx_name.value
      req.sq_name = sq_name.value
      req.jd_name = jd_name.value
      //console.log(req)
      // 新增
      if (dialogFlag.value === 'add') {
        console.log('add')
        const res = await createPlace(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddDialog()
        }
      }
      // 修改
      if (dialogFlag.value === 'edit') {
        console.log('edit')
        const res = await setPlace(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddDialog()
        }
      }
      
    }
  })

}

// 级联切换区/街道
const handleChange = (value) => {
  console.log(value)
  areaValue.value = value[0]
  streetValue.value = value[1]
  console.log(areaValue.value, streetValue.value)

  // 获取村选项列表
  let list = []
  for (let i = 0; i < vlgs.length; i++) {
    if (vlgs[i].streetCode == streetValue.value) {
      let temp = {}
      temp = { 'value': vlgs[i].code, 'label': vlgs[i].name }
      list.push(temp)
    }
  }
  cunList.value = list
}

// const handleSelect = (item) => {
//   console.log(item)
// }

const qx_name = ref('')
const sq_name = ref('')
const jd_name = ref('')
const qxSelect = (item) => {
  console.log(item)
  qx_name.value = item.name
  getXzList(item.code)
}
const getXzList = async(code) => {
  let qus = json.children;
  for (let i = 0; i < qus.length; i++) {
    if (qus[i].code == code) {
        xzList.value = qus[i].children 
        //console.log(xzList.value);
    }
  }
}
const xzSelect = (item) => {
  console.log(item)
  sq_name.value = item.name
  getCunList(item.code)
}
const getCunList = async(code) => {
  let list = []
  for (let i = 0; i < vlgs.length; i++) {
    if (vlgs[i].streetCode == code) {
      list.push(vlgs[i])
    }
  }
  cunList.value = list
}
const cunSelect = (item) => {
  console.log(item)
  jd_name.value = item.name
}
const hylxSelect = (item) => {
  hylx.value = item.code
}
</script>

<style lang="scss">
.excel-btn + .excel-btn {
  margin-left: 10px;
}

</style>
