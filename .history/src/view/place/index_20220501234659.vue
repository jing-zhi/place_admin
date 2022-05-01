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
        <el-table-column align="left" label="所属区县" min-width="80" prop="qx" />
        <el-table-column align="left" label="所属乡镇" min-width="80" prop="sq" />
        <el-table-column align="left" label="所属村" min-width="80" prop="jd" />
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

      <el-dialog
      v-model="addDialog"
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
  deleteUser,
} from '@/api/user'

import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { getPlaceList,setInfo } from '@/api/place.js'

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
            "qx":"ui",	//所属区县
            "sq":"uu",	//所属乡镇（社区）
            "jd":"qq",	//所属村（街道）
            "xxdz":"qqqee",	//详细地址
            "qyzt":1,	//启用状态（1使用 0未用，默认为1）
            "gldjd":11,	//经度CGCS2000坐标系 （非必填）
            "gldwd":11,	//纬度CGCS2000坐标系（非必填）
            "fzrxm":"xx",	//负责人姓名
            "fzrdh":111,	//负责人电话
            "fzrsfz":1,	//负责人身份证
            "fzrGzdw":"e",	//申领单位
            "slsj":"2022",	//申领时间
            "hylx":"ee"
        },
         {      
          "cd_id":2,	//记录id
            "csbh":111,	//场所编号 （有规则的，行业（2位）+市（新乡）+区+乡+村+6位数）
            "csmc":"yi",	//场所名称
            "qx":"ui",	//所属区县
            "sq":"uu",	//所属乡镇（社区）
            "jd":"qq",	//所属村（街道）
            "xxdz":"qqqee",	//详细地址
            "qyzt":1,	//启用状态（1使用 0未用，默认为1）
            "gldjd":11,	//经度CGCS2000坐标系 （非必填）
            "gldwd":11,	//纬度CGCS2000坐标系（非必填）
            "fzrxm":"xx",	//负责人姓名
            "fzrdh":111,	//负责人电话
            "fzrsfz":1,	//负责人身份证
            "fzrGzdw":"e",	//申领单位
            "slsj":"2022",	//申领时间
            "hylx":"ee"
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

const addPlace = () => {
  dialogFlag.value = 'add'
  addDialog.value = true
  console.log(1)
}

const enterAddDialog = async() => {
  // userForm.value.validate(async valid => {
  //   if (valid) {
  //     const req = {
  //       ...userInfo.value,
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
  //       const res = await setUserInfo(req)
  //       if (res.code === 0) {
  //         ElMessage({ type: 'success', message: '编辑成功' })
  //         await getTableData()
  //         closeAddUserDialog()
  //       }
  //     }
  //   }
  // })

 
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
