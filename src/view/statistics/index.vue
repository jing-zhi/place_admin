<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" style="margin-left: 20px" :model="searchInfo">
        <el-form-item label="所属行业">
          <el-select v-model="searchInfo.industry_id"  class="m-2" placeholder="所属行业" size="large">
            <el-option
              v-for="item in industryList"
              :key="item.Name"
              :label="item.Name"
              :value="item.ID"
              @click="changeId(item)"


            />
          </el-select>

        </el-form-item>
        <el-form-item label="地区" @click="onSearch">
          <el-cascader
            v-model="searchInfo.dept_id"
            style="width: 100%"
            @change="onSearch"
            :options="deptOptions"
            :props="{
              multiple: false,
              separator,
              checkStrictly: true,
              label: 'deptName',
              value: 'deptId',
              disabled: 'disabled',
              emitPath: false,
            }"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item label="场所名称" prop="place">
          <el-input
            v-model="searchInfo.place_name"
            placeholder="场所名称"
            @keyup="onSearch"
          ></el-input>
        </el-form-item>
        <el-form-item label="健康码信息">
          <el-select
            v-model="searchInfo.health_code_info"
            class="m-2"
            placeholder="健康码信息"
            size="large"
          >
            <el-option
              v-for="item in healthCode"
              @click="onSearch"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <el-table :data="tableData">
        <el-table-column
          align="center"
          label="场所名称"
          min-width="120"
          prop="place_name"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="登记总人数"
          prop="register_num"
          min-width="120"
        />
        <el-table-column
          align="center"
          label="今日扫码人数"
          prop="scan_num"
          min-width="120"
        />
        <el-table-column
          align="center"
          label="健康码信息"
          prop="health_code"
          min-width="120"
        />
        <el-table-column
          align="center"
          label="已做核酸人数"
          prop="have_nucleic_num"
          min-width="120"
        />
        <el-table-column
          align="center"
          label="未做核酸人数"
          prop="no_nucleic_num"
          min-width="120"
        />

        <el-table-column align="center" label="操作" min-width="120">
          <template #default="scope">
            <el-button type="text" @click="getDetail(scope.row)==true">异常详情</el-button>
          </template>

        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

      <!-- 弹出页面 -->
      <el-dialog v-model="exception" title="异常详情" width="40%">
        <div style="height: 60vh; overflow: auto; padding: 0 10px">
          <!-- <p>未扫码人员：</p>
             <el-table
            border
            :data="scanCodeDetail"
            style="width: 100%"
            :show-header="false"
            class="tableBox"
          >
            <el-table-column prop="gzryxm"  align="center" />
            <el-table-column prop="gzrysjh"  align="center" width="120">
            </el-table-column>
            <el-table-column prop="gzrysfz"  align="center">
            </el-table-column>
          </el-table> -->

          <p>未核酸人员：</p>
           <el-table
            border
            :data="nucleicAcidDetail"
            style="width: 100%"
            :show-header="false"
            class="tableBox"
          >
           <el-table-column prop="name"  align="center" />
            <!-- <el-table-column prop="gzrysjh"  align="center" width="120"/> -->
            <el-table-column prop="phone"  align="center" />
          </el-table>
          <!-- <p>健康码异常人员：</p>
            <el-table
            border
            :data="healthyCodeDetail"
            style="width: 100%"
            :show-header="false"
            class="tableBox"
          >
            <el-table-column prop="gzryxm"  align="center" />
            <el-table-column prop="gzrysjh"  align="center" width="120"/>
            <el-table-column prop="gzrysfz"  align="center" />
          </el-table> -->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw } from "vue";
import json from "@/utils/address/xinxiang.json";
import { getAreaList ,getExceptionInfo} from "@/api/manageAreaList.js";
import { getIndustryList} from '@/api/industry.js'

// 页面数据
const tableData = ref([]);
// 获取区县
const qxList = ref([]);

// 查询所有行业名称+id
const industryList = ref([])
const getIndustry = async() => {
  let rqt = { page: 1, pageSize: 100 }
  //console.log(rqt);
  const table = await getIndustryList(rqt)
  if (table.code === 0) {
    // console.log(table)
    industryList.value = table.data.list
  }
}
const changeId = (item) =>{

  page.value = 1;
  pageSize.value = 10;
  getRetFind();
  getTableData(retFind.value);
  ID.value = item.ID

  //console.log(ID.value);
}

// 分页
const page = ref(1);
const total = ref(0);
const pageSize = ref(10);

const handleSizeChange = (val) => {
  pageSize.value = val;
  getTableData(retFind.value);
};

const handleCurrentChange = (val) => {
  page.value = val;
  getTableData(retFind.value);
};

// 健康码信息
const healthCode = [
  { name: "正常" },
  { name: "异常" },
];

const deptOptions = ref([]);
const setDeptOptions = (deptData) => {
  deptOptions.value = [];
  setDepartmentOptions(deptData, deptOptions.value);
};

const setDepartmentOptions = (DeptData, optionsData) => {
  DeptData &&
    DeptData.forEach((item) => {
      if (item.children && item.children.length) {
        const option = {
          deptId: item.deptId,
          deptName: item.name,
          children: [],
        };
        setDepartmentOptions(item.children, option.children);
        optionsData.push(option);
      } else {
        const option = {
          deptId: item.deptId,
          deptName: item.name,
        };
        optionsData.push(option);
      }
    });
};

// 搜索
const retFind = {};
const searchInfo = ref({});
const onSearch = () => {
  page.value = 1;
  pageSize.value = 10;
  getRetFind();
  getTableData(retFind.value);
};

const getRetFind = () => {
  retFind.value = toRaw(searchInfo.value);
};

// 查询列表
const getTableData = async (value) => {
  let rqt = { page: page.value, pageSize: pageSize.value};
  if (value) {
    rqt = { page: page.value, pageSize: pageSize.value, ...value };
  }
  const table = await getAreaList(rqt);
  if (table.code === 0) {
    tableData.value = table.data.list;
    // this.$set(tableData,'value',table.data.list)

    console.log(tableData.value.length,1111111111)

    for(let i = 0; i < tableData.value.length; i++){
      if(tableData.value[i].health_code === 0){
        tableData.value[i].health_code = '正常'
      }else{
        tableData.value[i].health_code = '异常'
      }

    }
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }

};

const exceptionDetail=ref([])
const scanCodeDetail=ref([])
const nucleicAcidDetail=ref([])
const healthyCodeDetail=ref([])
// 显示异常
const exception = ref(false);

const getDetail = async(row) => {
    exceptionDetail.value=JSON.parse(JSON.stringify(row))
    // scanCodeDetail.value=exceptionDetail.value.not_scan_code_people;
    nucleicAcidDetail.value=exceptionDetail.value.not_nucleic_acid_people;
    // healthyCodeDetail.value=exceptionDetail.value.not_green_code;
    exception.value=!exception.value;

    console.log(row.place_num,11111111);


    const res = await getExceptionInfo({place_num: row.place_num})
    if(res.code === 0) {
      nucleicAcidDetail.value = res.data.no_nucleic_worker_list
    }
  }

const initPage = async () => {
  const depTs = [];
  depTs.push(json);
  setDeptOptions(depTs);
  qxList.value = json.children;
  getTableData();
  getIndustry();
};
initPage();
</script>

<style>
.tableBox tr {
  padding: 0 !important;
  height: 20px;
  line-height: 20px;
}
.tableBox td .cell {
  min-height: 20px !important;
  line-height: 20px !important;
  font-size: 14px !important;
}

.el-scrollbar__thumb{
  width: 0px !important;
  opacity: 0;
}

</style>
