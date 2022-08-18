<template>
  <div>
    <div class="gva-table-box">
      <div class="gva-btn-list"></div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column align="left" label="场所编号" min-width="230" prop="pcsbh" />
        <el-table-column align="left" label="场所名称" min-width="150" prop="pcsmc" show-overflow-tooltip />
        <el-table-column align="left" label="工作人员姓名" min-width="150" prop="pxm" />

        <el-table-column align="left" label="手机号码" min-width="150" prop="psjh">
          <template v-slot:="scope">
            <el-popover trigger="hover" placement="top">
              <span style="margin-left: 30px;">{{ scope.row.psjh }}</span>
              <template #reference>
                <span>{{formatter(scope.row.psjh,3,4) }}</span>
              </template>                   
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="left" label="身份证号码" min-width="170" prop="psfz">
          <template v-slot:="scope">
            <el-popover trigger="hover" placement="top" width="170px">
              <span style="margin-left: 20px;">{{ scope.row.psfz }}</span>
              <template #reference>
                <span>{{formatter(scope.row.psfz,3,4) }}</span>
              </template>                   
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="left" label="扫码时间" min-width="160" prop="ptime">
          <template #default="scope">
            {{tableData.smsj = scope.row.ptime?timestampToTime(scope.row.ptime):''}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'codeScanDetails',
}
</script>

<script setup>
import {
  getCodeScanDetail
} from '../../../api/csUser/worker.js'
// 查询搜索
import {  ref,reactive } from 'vue'
import { formatter } from '@/utils/format'

import { useRoute } from 'vue-router'

const router = useRoute()

let allTime = ref([])
let dataDetail = reactive({
  pid:router.params.pid,
  pcsbh:router.params.pcsbh,
  pxm:router.params.pxm,
  psjh:router.params.psjh,
  pcsmc:router.params.pcsmc,
  psfz:router.params.psfz,
  ptime:''
})


const tableData = ref([])

// 查询
const getTableTime = async() => {
  let rqt = {} 
    if(dataDetail.psfz){
      rqt = {gzrsfz: dataDetail.psfz,csmc: dataDetail.pcsmc}
    } else {
      rqt = {gzrysfz:' ',csmc:''}
    }
    
    const table = await getCodeScanDetail(rqt)
    if (table.code === 0) {
        allTime.value = table.data
        for (let i = 0; i < allTime.value.length; i++) {
          dataDetail.ptime = allTime.value[i]
          let a = {
            pid:dataDetail.pid,
            pcsbh:dataDetail.pcsbh,
            pxm:dataDetail.pxm,
            psjh:dataDetail.psjh,
            pcsmc:dataDetail.pcsmc,
            psfz:dataDetail.psfz,
            ptime:dataDetail.ptime.replace(/\-/g, "/")
          }
          tableData.value.push(a)
        }
    } 
}


const timestampToTime = (timestamp) => {
	var date = new Date(timestamp)
	var Y = date.getFullYear() + '-'
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
	var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
	return Y + M + D + h + m + s
}
// 初始化
const initPage = async() => {
    getTableTime()
}

initPage()
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

.el-row{
  padding: 0 !important;
}
</style>
