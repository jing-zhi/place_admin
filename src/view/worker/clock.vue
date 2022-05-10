<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchWorker" style="margin-left:20px">
          <el-form-item v-show="pid==null" label="姓名">
            <el-input v-model="searchWorker.gzryxm" min-width="50" placeholder="工作人员姓名" />
          </el-form-item>  
          <el-form-item v-show="pid==null" label="手机号">
            <el-input v-model="searchWorker.gzrysjh" min-width="80" placeholder="工作人员手机号" />
          </el-form-item>    
          <el-form-item v-show="pid==null" label="身份证">
            <el-input v-model="searchWorker.gzrysfz" min-width="80" placeholder="工作人员身份证" />
          </el-form-item>
          <el-form-item label="工作区域">
            <el-select v-model="searchWorker.gzqy" class="m-2" placeholder="请选择人员状态" size="large">
              <el-option
                v-for="item in gzqyList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                 @click="gzqySearch(item)"
              />
            </el-select>
          </el-form-item> 
          <el-form-item label="温度">
            <el-input v-model="searchWorker.temp_min" min-width="80" placeholder="最低" />
          </el-form-item> 
          <el-form-item>
            <el-input v-model="searchWorker.temp_max" min-width="80" placeholder="最高" />
          </el-form-item>   
          <el-form-item label="打卡时间范围">
              <el-date-picker
                    v-model="searchWorker.dk"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
          </el-form-item>   

          <el-form-item>
            <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
            
            <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list"></div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <!-- <el-table-column align="left" label="id" min-width="70" prop="id" /> -->
        <el-table-column align="left" label="场所编号" min-width="120" prop="csbh" />
        <el-table-column align="left" label="工作人员姓名" min-width="120" prop="gzryxm" />
        <el-table-column align="left" label="工作人员手机号" min-width="150" prop="gzrysjh" />
        <el-table-column align="left" label="身份证号" min-width="150" prop="gzrysfz" />
        <el-table-column align="left" label="工作区域" min-width="150" prop="gzqy" />
        <el-table-column align="left" label="温度" min-width="150" prop="gzrtw" />
        <el-table-column align="left" label="扫码时间" min-width="150" prop="smsj">
          <template #default="scope">
            {{tableData.smsj = scope.row.smsj?timestampToTime(scope.row.smsj):''}}
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
  name: 'workerclock',
}
</script>

<script setup>
import {
  getWorkerDetailsList,
  
} from '@/api/csUser/worker.js'
// 查询搜索
import { nextTick, ref, watch ,toRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import {formatTimeToStr} from '@/utils/date.js'
import { useRoute } from 'vue-router'
const router = useRoute()
const pid = ref(null)
pid.value = router.params.pid ? router.params.pid : null

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchWorker = ref({})

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
const getTableData = async(value) => {
    let rq = {  page: page.value, pageSize: pageSize.value }
    if(pid.value) {
        rq = { id: Number(pid.value), ...rq }
    }
    let rqt = {...rq}
    if(value) {
        rqt = { ...rq, ...value }   
    } 
    console.log(rqt);
    const table = await getWorkerDetailsList(rqt)
    if (table.code === 0) {
        tableData.value = table.data.list
        total.value = table.data.total
        page.value = table.data.page
        pageSize.value = table.data.pageSize
    } 
}

// 工作区域
const gzqyList = [
    {
        id: 1,
        name: "工作准备区",
    },
    {
        id: 2,
        name: "隔离区",
    },
    {
        id: 3,
        name: "工作人员隔离区",
    }
]

// 搜索
const onSubmit = async() => {
    let retFind = toRaw(searchWorker.value)
    if(searchWorker.value.dk) {
      retFind.start_time = Number(searchWorker.value.dk[0])
      retFind.end_time = Number(searchWorker.value.dk[1])
     // delete retFind.dk
    }
    if(retFind.temp_min) {
        retFind.temp_min = Number(retFind.temp_min)
    } else {
        delete retFind.temp_min
    }
    if(retFind.temp_max) {
        retFind.temp_max = Number(retFind.temp_max)
    } else {
        delete retFind.temp_max
    }
    
    console.log(toRaw(searchWorker.value));
    //console.log(searchWorker.value)

    getTableData(retFind)
}
const onReset = () => {
  searchWorker.value = {}
  getTableData()
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

const initPage = async() => {
    getTableData()
}

initPage()

const gzqyid = ref(null)
const gzqySearch = (item) => {
    gzqyid.value = item.id
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
