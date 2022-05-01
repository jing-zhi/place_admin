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
        <el-table-column align="left" label="记录ID" min-width="70" prop="cd_id" />
        <el-table-column align="left" label="场所编号" min-width="90" prop="csbh" />
        <el-table-column align="left" label="场所名称" min-width="100" prop="csmc" />
        <el-table-column align="left" label="所属区县" min-width="80" prop="qx_name" />
        <el-table-column align="left" label="所属乡镇" min-width="80" prop="sq_name" />
        <el-table-column align="left" label="所属村" min-width="80" prop="jd_name" />
        <el-table-column align="left" label="详细地址" min-width="200" prop="xxdz"/>
        <el-table-column align="left" label="启用状态" min-width="80" prop="qyzt">
          <template #default="scope">
            <!-- <el-cascader
              v-model="scope.row.deptId"
              :options="deptOptions"
              :show-all-levels="false"
              collapse-tags
              :props="{ multiple:false,checkStrictly: true,label:'deptName',value:'deptId',disabled:'disabled',emitPath:false}"
              :clearable="false"
              @visible-change="(flag)=>{changeDept(scope.row,flag)}"
              @remove-tag="()=>{changeDept(scope.row,false)}"
            /> -->
            <el-switch
              v-model="scope.row.status"
              on-value="1"
              off-value="0"
              @change="switchChange(scope.row)"
            />

          </template>
        </el-table-column>
        <el-table-column align="left" label="经度" min-width="80" prop="gldjd" />
        <el-table-column align="left" label="纬度" min-width="80" prop="gldwd" />
        <el-table-column align="left" label="负责人姓名" min-width="100" prop="fzrxm" />
        <el-table-column align="left" label="负责人电话" min-width="100" prop="fzrdh" />
        <el-table-column align="left" label="负责人身份证" min-width="150" prop="fzrsfz" />
        <el-table-column align="left" label="申领单位" min-width="180" prop="fzrGzdw" />
        <el-table-column align="left" label="申领时间" min-width="180" prop="slsj" />
        <el-table-column align="left" label="行业类型" min-width="120" prop="hylx" />
        <el-table-column label="操作" min-width="150" fixed="right">
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
        <el-form ref="placeForm" :model="placeInfo" label-width="100px">
          <el-form-item label="场所名称" prop="csmc">
            <el-input v-model="placeInfo.csmc" />
          </el-form-item>
          <!-- 下拉框 -->
          <el-form-item label="所属区县" prop="qx_name">
            <el-input v-model="placeInfo.qx" />
          </el-form-item>
          <el-form-item label="所属乡镇" prop="sq_name">
            <el-input v-model="placeInfo.sq" />
          </el-form-item>
          <el-form-item label="所属村" prop="jd_name">
            <el-input v-model="placeInfo.jd" />
          </el-form-item>
          <el-form-item label="详细地址" prop="xxdz">
            <el-input v-model="placeInfo.xxdz" />
          </el-form-item>
          <el-form-item label="启用状态" prop="qyzt">
            	<!-- <el-radio v-model="placeInfo.qyzt" label="1">是</el-radio>
              <el-radio v-model="placeInfo.qyzt" label="0">否</el-radio>
              选中:{{placeInfo.qyzt}} -->
              <el-select v-model="placeInfo.qyzt" style="width:100%" placeholder="是否启用">
              <el-option :value="0" label="否" />
              <el-option :value="1" label="是" />
            </el-select>
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
          <!-- 时间 -->
          <el-form-item label="申领时间" prop="slsj">
            <!-- <el-input v-model="placeInfo.slsj" /> -->
            <el-date-picker
              v-model="placeInfo.slsj"
              type="datetime"
              placeholder="Select date and time"
              :default-time="defaultTime"
            />
          </el-form-item>
          <el-form-item label="行业类型" prop="hylx">
            <el-select v-model="placeInfo.hylx" class="m-2" placeholder="Select" size="large">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- <el-input v-model="placeInfo.hylx" /> -->
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
import { ElMessage, ElMessageBox } from 'element-plus'

import { getPlaceList,,setInfo,deletePlace } from '@/api/place.js'

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async() => {
//   const table = await getTableData({ page: page.value, pageSize: pageSize.value })
//   if (table.code === 0) {
//     tableData.value = table.data.list
//     total.value = table.data.total
//     page.value = table.data.page
//     pageSize.value = table.data.pageSize
//   }

    const table = {}
  table.data = {
    "list": [
        {      
          "cd_id":1,	//记录id
            "csbh":111,	//场所编号 （有规则的，行业（2位）+市（新乡）+区+乡+村+6位数）
            "csmc":"yi",	//场所名称
            "qx_name":"ui",	//所属区县
            "sq_name":"uu",	//所属乡镇（社区）
            "jd_name":"qq",	//所属村（街道）
            "xxdz":"qqqee",	//详细地址 ?
            "qyzt":1,	//启用状态（1使用 0未用，默认为1）
            "gldjd":11,	//经度CGCS2000坐标系 （非必填）
            "gldwd":11,	//纬度CGCS2000坐标系（非必填）
            "fzrxm":"xx",	//负责人姓名
            "fzrdh":111,	//负责人电话
            "fzrsfz":1,	//负责人身份证
            "fzrGzdw":"e",	//申领单位
            "slsj":"2022",	//申领时间
            "hylx":1
        },
        {      
          "cd_id":2,	//记录id
            "csbh":111,	//场所编号 （有规则的，行业（2位）+市（新乡）+区+乡+村+6位数）
            "csmc":"yi",	//场所名称
            "qx_name":"ui",	//所属区县
            "sq_name":"uu",	//所属乡镇（社区）
            "jd_name":"qq",	//所属村（街道）
            "xxdz":"qqqee",	//详细地址 ?
            "qyzt":1,	//启用状态（1使用 0未用，默认为1）
            "gldjd":11,	//经度CGCS2000坐标系 （非必填）
            "gldwd":11,	//纬度CGCS2000坐标系（非必填）
            "fzrxm":"xx",	//负责人姓名
            "fzrdh":111,	//负责人电话
            "fzrsfz":1,	//负责人身份证
            "fzrGzdw":"e",	//申领单位
            "slsj":"2022",	//申领时间
            "hylx":1
        }
    ],
    "total": 2,
    "page": 1,
    "pageSize": 10
    }
    console.log(table.data)
    //tableData.value = table.data.list.map(item )
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize

    
}

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
const initPage = async() => {
  getTableData()
//   const authorities = await getAuthorityList({ page: 1, pageSize: 999 })
//   setAuthOptions(authorities.data.list)
//   const depTs = await getDeptList({ page: 1, pageSize: 999 })
//   setDeptOptions(depTs.data.list)
}

initPage()

const switchChange = (row) => {
    console.log(row)
    // console.log(row.cd_id)
    const data = { id: row.cd_id }
    console.log(data)
    // 启用
    //   pushNotice(data).then(() => {
    //   })
}

// 弹窗
const addDialog = ref(false)
const closeAddDialog = () => {
  placeForm.value.resetFields()

  addDialog.value = false
}
const dialogFlag = ref('add')

// 新增
const addPlace = () => {
  dialogFlag.value = 'add'
  addDialog.value = true
  
}
// 删除
const deletePlaceFun = async(row) => {
  console.log(row.cd_id)
  const res = await deletePlace({ id: row.cd_id })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      row.visible = false
      await getTableData()
    }
}

// 弹窗
const placeInfo = ref({
  "csmc":"223",
    "qx":"410702",
    "qx_name":"红旗区",
    "sq":"410702001",
    "sq_name":"西街街道",
    "jd":"410702001016",
    "jd_name":"曙光社区居民委员会",
    "xxdz":"242",
    "qyzt":0,
    "gldjd":"242",
    "gldwd":"242",
    "fzrxm":"242",
    "fzrdh":"12458598232",
    "fzrsfz":"422322422322422322",
    "fzrgzdw":"sdsa",
    "slsj":"1998-03-24 20:58:41",
    "hylx":1
})
const rules = ref({
  csmc: [
    { required: true, message: '请输入名', trigger: 'blur' },
    { min: 5, message: '最低5位字符', trigger: 'blur' },
  ],
  qx: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    { min: 6, message: '最低6位字符', trigger: 'blur' },
  ],


})

const placeForm = ref(null)
const enterAddDialog = async() => {
  // placeForm.value.validate(async valid => {
  //   if (valid) {
  //     const req = {
  //       ...placeInfo.value,
  //     }
  //     if (dialogFlag.value === 'add') {
  //       const res = await register(req)
  //       if (res.code === 0) {
  //         ElMessage({ type: 'success', message: '创建成功' })
  //         await getTableData()
  //         closeAddUserDialog()
  //       }
  //     }
  //     if (dialogFlag.value === 'edit') {
  //       const res = await setplaceInfo(req)
  //       if (res.code === 0) {
  //         ElMessage({ type: 'success', message: '编辑成功' })
  //         await getTableData()
  //         closeAddUserDialog()
  //       }
  //     }
  //   }
  // })
      const req = {
        ...placeInfo.value,
      }
      console.log(req)
      // 新增
      if (dialogFlag.value === 'add') {
        const res = await addPlace(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      // 修改
      if (dialogFlag.value === 'edit') {
        const res = await setInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
}


</script>

<style lang="scss">
.user-dialog {
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .header-img-box {
    width: 200px;
    height: 200px;
    border: 1px dashed #ccc;
    border-radius: 20px;
    text-align: center;
    line-height: 200px;
    cursor: pointer;
  }
}

.nickName {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pointer {
  cursor: pointer;
  font-size: 16px;
  margin-left: 2px;
}
.excel-btn+.excel-btn{
  margin-left: 10px;
}
</style>
