<template>
  <div>
      <div class="gva-search-box">
      <el-form :inline="true" :model="search" style="margin-left: 20px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="场所名称" required>
              <el-autocomplete
                v-model="search.place_name"
                :fetch-suggestions="querySearch"
                clearable
                placeholder="场所名称"
                @select="handleSelect"
                @focus.once="handleInput"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="扫码时间范围" label-width="auto" required>
              <el-date-picker
                v-model="search.dl"
                type="datetimerange"
                range-separator=":"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="changeDLTime"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list"></div>
        <el-table
          :data="tableData"
          row-key="ID"
        >
          <el-table-column align="left" label="场所编号" min-width="230" prop="place_num" />
          <el-table-column align="left" label="场所名称" min-width="150" prop="place_name" show-overflow-tooltip />
          <el-table-column align="left" label="工作人员姓名" min-width="150" prop="name" />

          <el-table-column align="left" label="手机号码" min-width="150" prop="phone_num">
            <template v-slot:="scope">
              <el-popover trigger="hover" placement="top">
                <span style="margin-left: 30px;">{{ scope.row.phone_num }}</span>
                <template #reference>
                  <span>{{formatter(scope.row.phone_num,3,4) }}</span>
                </template>                   
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="left" label="身份证号码" min-width="170" prop="card_id">
            <template v-slot:="scope">
              <el-popover trigger="hover" placement="top" width="170px">
                <span style="margin-left: 20px;">{{ scope.row.card_id }}</span>
                <template #reference>
                  <span>{{formatter(scope.row.card_id,3,4) }}</span>
                </template>                   
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="left" label="扫码时间" min-width="160" prop="scan_time">
            <template #default="scope">
              {{tableData.scan_time = scope.row.scan_time?formDate(scope.row.scan_time):''}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="gva-pagination">
        <el-pagination
          v-model:currentPage="searchContent.page"
          v-model:page-size="searchContent.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="search.total"
        />
      </div>

  </div>
</template>

<script>
export default {
  name: 'codeScanDetails',
}
</script>

<script setup>
import {getPlaceContent, getTabledata} from '../../../api/codeScanDetails.js'
// 查询搜索
import {  ref,reactive, onMounted} from 'vue'
import { formatDate,formatter } from '@/utils/format'

import { useRoute } from 'vue-router'

const router = useRoute()

// let allTime = ref([])
// let dataDetail = reactive({
//   pid:router.params.pid,
//   pcsbh:router.params.pcsbh,
//   pxm:router.params.pxm,
//   psjh:router.params.psjh,
//   pcsmc:router.params.pcsmc,
//   psfz:router.params.psfz,
//   ptime:''
// })


const tableData = ref([])
const search = reactive({
  place_name:'',
  dl:'',
  total:0
})
// 定义查询内容
const searchContent = reactive({
  place_num:'',
  place_name:'',
  start_time:'',
  end_time:'',
  page:1,
  pageSize:10
})
const searchPlace = reactive({
  page:1,
  pageSize:99,
  csmc:search.place_name
})


//模糊查询的列表
const placeList = ref([]);


const querySearch = (queryString,cb) => {
  const results = ref(queryString
    ? placeList.value.filter(createFilter(queryString))
    : placeList.value)
  cb(results.value)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item) => {
  searchContent.place_num = item.csbh;
  searchContent.place_name = item.value;
  if(search.dl!==""){
    getTable();
  }
}

const handleInput = async(value) => {
  searchPlace.csmc = value
  placeList.value = (await getPlaceContent(searchPlace)).data.list.map(item=>{
  let res = {};
  res.value = item.csmc;
  res.csbh = item.csbh;
  return res;
 })
}

const changeDLTime = () => {
  searchContent.start_time = formDate(search.dl[0]);
  searchContent.end_time = formDate(search.dl[1]);
  if(searchContent.place_name!==""){
    getTable();
  }
}

const handleSizeChange = (value) => {
  searchContent.pageSize = value;
  getTable();

}

const handleCurrentChange = (value) => {
  searchContent.page = value;
  getTable();
}

const getTable = async() => {
    const data = (await getTabledata(searchContent)).data;
    search.total = data.total;
    tableData.value = (await getTabledata(searchContent)).data.list;
}

const formDate = (timestamp) => {
	var date = new Date(timestamp)
	var Y = date.getFullYear() + '-'
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
	var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
	return Y + M + D + h + m + s
}

// 查询
// const getTableTime = async() => {
//     let rqt = {} 
//     if(dataDetail.psfz){
//       rqt = {gzrsfz: dataDetail.psfz,csmc: dataDetail.pcsmc}
//     } else {
//       rqt = {gzrsfz:' ',csmc:' '}
//     }
    
//     const table = await getCodeScanDetail(rqt)
//     if (table.code === 0) {
//         allTime.value = table.data
//         for (let i = 0; i < allTime.value.length; i++) {
//           dataDetail.ptime = allTime.value[i]
//           let a = {
//             pid:dataDetail.pid,
//             pcsbh:dataDetail.pcsbh,
//             pxm:dataDetail.pxm,
//             psjh:dataDetail.psjh,
//             pcsmc:dataDetail.pcsmc,
//             psfz:dataDetail.psfz,
//             ptime:dataDetail.ptime.replace(/\-/g, "/")
//           }
//           tableData.value.push(a)
//         }
//     }
// }


// s
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

.el-form-item__content{
  height: 34px;
  line-height: 34px;
}
</style>
