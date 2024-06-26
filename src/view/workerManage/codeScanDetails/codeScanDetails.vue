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
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="扫码时间范围" label-width="auto" required>
              <el-date-picker
                  v-model="search.dl"
                  type="datetimerange"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  range-separator=":"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  @change="changeDLTime"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-left: 20px">
            <el-form-item label="人员范围" label-width="auto" required>
              <el-select
                  v-model="searchContent.personnel_scope"
                  @change="changeDLTime"
              >
                <el-option
                    v-for="(v, i) in personnel_options"
                    :key=i
                    :label=v
                    :value=i
                />
              </el-select>
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
        <el-table-column align="left" label="场所名称" min-width="80" prop="place_name" show-overflow-tooltip/>
        <el-table-column align="left" label="工作人员姓名" min-width="80" prop="scan_person_name"/>
        <el-table-column align="left" label="手机号码" min-width="80" prop="phone_num">
          <template v-slot:="scope">
            <el-popover trigger="hover" placement="top">
              <span style="margin-left: 30px;">{{ scope.row.phone_num }}</span>
              <template #reference>
                <span>{{ formatter(scope.row.phone_num, 3, 4) }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="left" label="身份证号码" min-width="80" prop="card_id">
          <template v-slot:="scope">
            <el-popover trigger="hover" placement="top" width="170px">
              <span style="margin-left: 20px;">{{ scope.row.card_id }}</span>
              <template #reference>
                <span>{{ formatter(scope.row.card_id, 3, 4) }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="left" label="健康码" min-width="50" prop="health_code_color"/>
        <el-table-column align="left" label="扫码时间" min-width="160" prop="scan_time">
          <template #default="scope">
            {{ tableData.scan_time = scope.row.scan_time ? scope.row.scan_time.replace(/\-/g, "/") : '' }}
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
            @current-change="getTable"
            @size-change="getTable"
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
import {getPlaceContent, getTabledata} from '@/api/codeScanDetails'
import {ref, reactive, onMounted} from 'vue'
import {formatter} from '@/utils/format'
import {useRoute} from 'vue-router'

const router = useRoute()
const tableData = ref([])
const search = reactive({
  place_name: '',
  dl: [],
  total: 0
})
const personnel_options = ["全部", "工作人员", "非工作人员"]
// 定义查询内容
const searchContent = reactive({
  personnel_scope: 0,
  place_num: '',
  place_name: '',
  start_time: '',
  end_time: '',
  page: 1,
  pageSize: 10
})
const searchPlace = reactive({
  page: 1,
  pageSize: 10,
  csmc: search.place_name
})
const placeList = ref([]);
const querySearch = async (queryString, cb) => {
  await handleFocus(queryString)
  if (cb === undefined) {
    search.place_name = placeList.value[0].value
    handleSelect(placeList.value[0])
  } else {
    cb(placeList.value)
  }
}

const handleSelect = (item) => {
  searchContent.place_num = item.csbh;
  searchContent.place_name = item.value;
  changeDLTime();
}

const handleFocus = async(value) => {
  searchPlace.csmc = value
  placeList.value = (await getPlaceContent(searchPlace)).data.list.map((item, index) => {
    let res = {};
    res.value = item.csmc;
    res.csbh = item.csbh;
    return res;
  })
}

const changeDLTime = () => {
  searchContent.start_time = search.dl[0];
  searchContent.end_time = search.dl[1];
  getTable();
}

const getTable = async() => {
  const data = (await getTabledata(searchContent)).data;
  search.total = data.total;
  tableData.value = data.list;
}

onMounted(() => {
  search.dl[0] = (new Date()).Format("yyyy-MM-dd 00:00:00")
  search.dl[1] = (new Date()).Format("yyyy-MM-dd hh:mm:ss")
  querySearch()
})
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
