<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchWorker" style="margin-left:20px">

            <el-row>
              <el-col :span="5">
              <!-- <el-form-item v-show="pid==null" label="场所编号" prop="csbh">
                <el-input v-model="searchWorker.csbh"   placeholder="场所编号" />
              </el-form-item> -->
                <el-form-item label="宿舍编号" prop="csbh">
                  <el-input v-model="searchWorker.csbh" min-width="80"   placeholder="宿舍编号" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <!--  <el-form-item v-show="pid==null" label="场所名称" prop="csmc">
                  <el-input v-model="searchWorker.csmc"   placeholder="场所名称" />
                </el-form-item>  -->

                <el-form-item label="宿舍名称" prop="csmc">
                  <el-input v-model="searchWorker.csmc" min-width="80"   placeholder="宿舍名称" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="学生姓名">
                  <el-input  min-width="80" v-model="searchWorker.gzryxm" placeholder="学生姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="手机号">
                  <el-input v-model="searchWorker.gzrysjh" min-width="80" placeholder="学生手机号" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="5">
                 <el-form-item label="身份证号">
                  <el-input v-model="searchWorker.gzrysfz" min-width="80" placeholder="学生身份证" />
                </el-form-item>
              </el-col>
<!--              <el-col :span="5">-->
<!--                <el-form-item label="工作区域">-->
<!--                  <el-select  min-width="80" style="width:98%" v-model="searchWorker.gzqy" class="m-2" placeholder="请选择" size="large">-->
<!--                    <el-option-->
<!--                      v-for="item in gzqyList"-->
<!--                      :key="item.id"-->
<!--                      :label="item.name"-->
<!--                      :value="item.name"-->
<!--                      @click="gzqySearch(item)"-->
<!--                    />-->
<!--                  </el-select>-->
<!--               </el-form-item>-->
<!--              </el-col>-->
              <el-col :span="8">
                <el-form-item label="体温范围">
                  <el-input v-model="searchWorker.temp_min" :inline="true" style="width: 120px" placeholder="最低体温" />
                  <div style="width: 20px;text-align:center;color: #606266;">-</div>
                  <el-input v-model="searchWorker.temp_max" :inline="true" style="width: 120px" placeholder="最高体温" />
                </el-form-item>
              </el-col>
            </el-row>
             <el-row>
                <el-col :span="10">
                  <el-form-item label="扫码时间范围" label-width="auto">
                    <el-date-picker
                      v-model="searchWorker.dk"
                      @change="changeTime"
                      type="datetimerange"
                      range-separator=":"
                      :default-time="defaultTime"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item>
                    <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>

                    <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>


          <!-- <el-form-item v-show="pid==null" label="姓名">
            <el-input v-model="searchWorker.gzryxm" min-width="50" placeholder="工作人员姓名" />
          </el-form-item>
          <el-form-item v-show="pid==null" label="手机号">
            <el-input v-model="searchWorker.gzrysjh" min-width="80" placeholder="工作人员手机号" />
          </el-form-item>
          <el-form-item v-show="pid==null" label="身份证">
            <el-input v-model="searchWorker.gzrysfz" min-width="80" placeholder="工作人员身份证" />
          </el-form-item> -->

          <!-- <el-form-item label="扫码时间范围">
              <el-date-picker
                    v-model="searchWorker.dk"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
          </el-form-item>    -->


        </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list"></div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <!-- <el-table-column align="left" label="id" min-width="70" prop="id" /> -->
        <el-table-column align="left" label="宿舍编号" min-width="230" prop="csbh" />
        <el-table-column align="left" label="宿舍名称" min-width="150" prop="CdJoin.csmc" show-overflow-tooltip />
        <el-table-column align="left" label="学生姓名" min-width="150" prop="gzryxm" />

        <el-table-column align="left" label="手机号码" min-width="150" prop="gzrysjh">
          <template v-slot:="scope">
            <el-popover trigger="hover" placement="top">
              <span style="margin-left: 30px;">{{ scope.row.gzrysjh }}</span>
              <template #reference>
                <span>{{formatter(scope.row.gzrysjh,3,4) }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="left" label="身份证号码" min-width="170" prop="gzrysfz">
          <template v-slot:="scope">
            <el-popover trigger="hover" placement="top" width="170px">
              <span style="margin-left: 20px;">{{ scope.row.gzrysfz }}</span>
              <template #reference>
                <span>{{formatter(scope.row.gzrysfz,3,4) }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
<!--        <el-table-column align="left" label="工作区域" min-width="150" prop="gzqy" />-->
        <el-table-column align="left" label="体温" min-width="150" prop="gzrtw" />
        <el-table-column align="left" label="扫码时间" min-width="160" prop="smsj">
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
import { formatDate,formatter } from '@/utils/format'

import {formatTimeToStr} from '@/utils/date.js'
import { useRoute } from 'vue-router'
import { debounce } from '@/utils/debounce.js'

const router = useRoute()
const pid = ref(null)
pid.value = router.params.pid ? router.params.pid : null

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchWorker = ref({})
const defaultTime = [
  new Date(2022,1,1,0,0,0),
  new Date(2022,1,1,23,59,59)
]
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData(retFind.value)
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData(retFind.value)
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

const retFind = ref({})
// 搜索
const onSubmit = debounce(() => {

    retFind.value = getRetFind()
    getTableData(retFind.value)
})
const changeTime = (e) => {
  //console.log(e);
};
const getRetFind = () => {
      let retFind = toRaw(searchWorker.value)
    if(searchWorker.value.dk) {
      retFind.start_time = Number(searchWorker.value.dk[0])
      retFind.end_time = Number(searchWorker.value.dk[1])
      //delete retFind.dk
    } else {
      //delete retFind.dk
      delete retFind.start_time
      delete retFind.end_time
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

    return retFind
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

.el-row{
  padding: 0 !important;
}
</style>
