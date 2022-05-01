<template>
  <div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button class="excel-btn" size="small" type="primary" icon="plus" @click="addUser">新增用户</el-button>
        <el-button class="excel-btn" size="small" type="primary" icon="download" @click="handleExcelExport('ExcelExport.xlsx')">导出</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column align="left" label="记录ID" min-width="70" prop="pid" />
        <el-table-column align="left" label="场所编号" min-width="150" prop="pnum" />
        <el-table-column align="left" label="场所名称" min-width="150" prop="pname" />
        <el-table-column align="left" label="所属区县" min-width="180" prop="phone" />
        <el-table-column align="left" label="所属乡镇" min-width="180" prop="email" />
        <el-table-column align="left" label="所属村" min-width="200" prop="" />
        <el-table-column align="left" label="地址" min-width="200">
          <template #default="scope">
            <el-cascader
              v-model="scope.row.deptId"
              :options="deptOptions"
              :show-all-levels="false"
              collapse-tags
              :props="{ multiple:false,checkStrictly: true,label:'deptName',value:'deptId',disabled:'disabled',emitPath:false}"
              :clearable="false"
              @visible-change="(flag)=>{changeDept(scope.row,flag)}"
              @remove-tag="()=>{changeDept(scope.row,false)}"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" label="启用状态" min-width="180" prop="status" />
        <el-table-column align="left" label="经度" min-width="180" prop="" />
        <el-table-column align="left" label="纬度" min-width="180" prop="email" />
        <el-table-column label="操作" min-width="150" fixed="right">
          <template #default="scope">
            <el-popover v-model:visible="scope.row.visible" placement="top" width="160">
              <p>确定要删除此用户吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="deleteUserFunc(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button type="text" icon="delete" size="small">删除</el-button>
              </template>
            </el-popover>
            <el-button type="text" icon="edit" size="small" @click="openEdit(scope.row)">编辑</el-button>       
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
    </div>
    <el-dialog
      v-model="addUserDialog"
      custom-class="user-dialog"
      title="用户"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="80px">
          <el-form-item v-if="dialogFlag === 'add'" label="用户名" prop="userName">
            <el-input v-model="userInfo.userName" />
          </el-form-item>
          <el-form-item v-if="dialogFlag === 'add'" label="密码" prop="password">
            <el-input v-model="userInfo.password" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="userInfo.nickName" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userInfo.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email" />
          </el-form-item>
          <el-form-item label="用户部门" prop="deptId">
            <el-cascader
              v-model="userInfo.deptId"
              style="width:100%"
              :options="deptOptions"
              :show-all-levels="false"
              :props="{ multiple:false,checkStrictly: true,label:'deptName',value:'deptId',disabled:'disabled',emitPath:false}"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="用户角色" prop="authorityId">
            <el-cascader
              v-model="userInfo.authorityIds"
              style="width:100%"
              :options="authOptions"
              :show-all-levels="false"
              :props="{ multiple:true,checkStrictly: true,label:'authorityName',value:'authorityId',disabled:'disabled',emitPath:false}"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="头像" label-width="80px">
            <el-upload
              :action="`${path}/file/upload`"
              :headers="{ 'x-token': userStore.token }"
              :show-file-list="false"
              :on-progress="onImageProgress"
              :on-success="handleImageSuccess"
              :on-error="handleImageSuccess"
              :before-upload="beforeImageUpload"
              :multiple="false"
            >
              <img
                v-if="userInfo.headerImg"
                class="header-img-box"
                :src="(userInfo.headerImg && userInfo.headerImg.slice(0, 4) !== 'http')?path + '/' +userInfo.headerImg:userInfo.headerImg"
              >
              <div v-else class="header-img-box">上传头像</div>
            </el-upload>
          </el-form-item>
        </el-form>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeAddUserDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterAddUserDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
}
</script>

<script setup>

import {
  getUserList,
  setUserAuthorities,
  register,
  deleteUser,
} from '@/api/user'

import CustomPic from '@/components/customPic/index.vue'
import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { getAuthorityList } from '@/api/authority'
import { getDeptList } from '@/api/dept'
import { setUserInfo, resetPassword } from '@/api/user.js'
import { useUserStore } from '@/pinia/modules/user'
import { exportExcel, loadExcelData, downloadTemplate } from '@/api/excel'
import ImageCompress from '@/utils/image'

const userStore = useUserStore()
const path = ref(import.meta.env.VITE_BASE_API)
const fileSize = ''
const maxWH = ''

// 上传头像相关

const onImageProgress = (res) => {
  ElMessage.warning('文件上传中，请耐心等待!')
}

const beforeImageUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPng = file.type === 'image/png'
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isJPG && !isPng) {
    ElMessage.error('上传头像图片只能是 jpg或png 格式!')
    return false
  }

  if (!isLt5M) {
    // 压缩
    const compress = new ImageCompress(file, fileSize, maxWH)
    return compress.compress()
  }
  return isLt5M
}

const handleImageSuccess = (res) => {
  const { data } = res
  if (data.file) {
    ElMessage.success('文件上传成功!')
    userInfo.value.headerImg = data.file.url
  } else {
    ElMessage.error('文件上传失败!')
  }
}

// 初始化相关
const setAuthorityOptions = (AuthorityData, optionsData) => {
  AuthorityData &&
  AuthorityData.forEach(item => {
    if (item.children && item.children.length) {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName,
        children: [],
      }
      setAuthorityOptions(item.children, option.children)
      optionsData.push(option)
    } else {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName,
      }
      optionsData.push(option)
    }
  })
}

const setDepartmentOptions = (DeptData, optionsData) => {
  DeptData &&
  DeptData.forEach(item => {
    if (item.children && item.children.length) {
      const option = {
        deptId: item.ID,
        deptName: item.deptName,
        children: [],
      }
      setDepartmentOptions(item.children, option.children)
      optionsData.push(option)
    } else {
      const option = {
        deptId: item.ID,
        deptName: item.deptName,
      }
      optionsData.push(option)
    }
  })
}

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
  const table = await getUserList({ page: page.value, pageSize: pageSize.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

watch(tableData, () => {
  setAuthorityIds()
})

const initPage = async() => {
  getTableData()
  const authorities = await getAuthorityList({ page: 1, pageSize: 999 })
  setAuthOptions(authorities.data.list)
  const depTs = await getDeptList({ page: 1, pageSize: 999 })
  setDeptOptions(depTs.data.list)
}

initPage()

const resetPasswordFunc = (row) => {
  ElMessageBox.confirm(
    '是否将此用户密码重置为123456?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(async() => {
    const res = await resetPassword({
      ID: row.ID,
    })
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: res.msg,
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
  })
}
const setAuthorityIds = () => {
  tableData.value && tableData.value.forEach((user) => {
    const authorityIds = user.authorities && user.authorities.map(i => {
      return i.authorityId
    })
    user.authorityIds = authorityIds
  })
}

const authOptions = ref([])
const setAuthOptions = (authData) => {
  authOptions.value = []
  setAuthorityOptions(authData, authOptions.value)
}

const deptOptions = ref([])
const setDeptOptions = (deptData) => {
  deptOptions.value = []
  setDepartmentOptions(deptData, deptOptions.value)
}

const deleteUserFunc = async(row) => {
  const res = await deleteUser({ id: row.ID })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}

// 弹窗相关
const userInfo = ref({
  userName: '',
  password: '',
  nickName: '',
  headerImg: '',
  authorityId: '',
  authorityIds: [],
  deptId: '',
})

const rules = ref({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, message: '最低5位字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    { min: 6, message: '最低6位字符', trigger: 'blur' },
  ],
  nickName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
  ],
  authorityIds: [
    { required: true, message: '请选择用户角色', trigger: 'blur' },
  ],
  deptId: [
    { required: true, message: '请选择用户角色', trigger: 'blur' },
  ],
})
const userForm = ref(null)
const enterAddUserDialog = async() => {
  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...userInfo.value,
      }
      if (dialogFlag.value === 'add') {
        const res = await register(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await setUserInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
    }
  })
}

const addUserDialog = ref(false)
const closeAddUserDialog = () => {
  userForm.value.resetFields()
  userInfo.value.headerImg = ''
  userInfo.value.userName = ''
  userInfo.value.nickName = ''
  userInfo.value.authorityIds = []
  userInfo.value.deptId = ''
  addUserDialog.value = false
}

const dialogFlag = ref('add')

const addUser = () => {
  dialogFlag.value = 'add'
  addUserDialog.value = true
}
const changeAuthority = async(row, flag) => {
  if (flag) {
    return
  }

  await nextTick()
  const res = await setUserAuthorities({
    ID: row.ID,
    authorityIds: row.authorityIds,
  })
  if (res.code === 0) {
    ElMessage({ type: 'success', message: '角色设置成功' })
  }
}

const changeDept = async(row, flag) => {
  if (flag) {
    return
  }

  await nextTick()
  const res = await setUserInfo({
    ID: row.ID,
    deptId: row.deptId,
  })
  if (res.code === 0) {
    ElMessage({ type: 'success', message: '部门设置成功' })
  }
}

const openEdit = (row) => {
  dialogFlag.value = 'edit'
  userInfo.value = JSON.parse(JSON.stringify(row))
  addUserDialog.value = true
}

const handleExcelExport = (fileName) => {
  if (!fileName || typeof fileName !== 'string') {
    fileName = 'ExcelExport.xlsx'
  }
  exportExcel(tableData.value, fileName)
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
