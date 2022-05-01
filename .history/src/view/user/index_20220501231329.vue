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
        <el-table-column align="left" label="id" min-width="70" prop="id" />
        <el-table-column align="left" label="场所编号" min-width="90" prop="gldbh" />
        <el-table-column align="left" label="工作人员姓名" min-width="100" prop="" />
        <el-table-column align="left" label="工作人员手机号" min-width="80" prop="Qx" />
        <el-table-column align="left" label="身份证号" min-width="80" prop="Sq" />
        <el-table-column align="left" label="所在地市" min-width="80" prop="jd" />
        <el-table-column align="left" label="所在县区" min-width="200" prop="xdz"/>
        <el-table-column align="left" label="所在乡编码" min-width="80" prop="Qyzt">
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
        <el-table-column align="left" label="负责人电话" min-width="100" prop="Fzrdh" />
        <el-table-column align="left" label="负责人身份证" min-width="150" prop="Fzrsfz" />
        <el-table-column align="left" label="申领单位" min-width="180" prop="fzrGzdw" />
        <el-table-column align="left" label="申领时间" min-width="180" prop="Slsj" />
        <el-table-column align="left" label="行业类型" min-width="120" prop="Hylx" />
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
    console.log(row.cd_id)
    const data = { id: row.cd_id }
    //console.log(data)

    //   pushNotice(data).then(() => {
    //   })
}

const addUser = () => {
//   dialogFlag.value = 'add'
//   addUserDialog.value = true
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
