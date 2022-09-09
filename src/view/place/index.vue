<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchPlace" style="margin-left:20px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="场所编号" prop="csbh">
              <el-input v-model="searchPlace.csbh" min-width="80" placeholder="场所编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="场所名称" prop="csmc">
              <el-input v-model="searchPlace.csmc" min-width="80" placeholder="场所名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="负责人姓名">
              <el-input v-model="searchPlace.fzrxm" min-width="80" placeholder="负责人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="负责人电话">
              <el-input v-model="searchPlace.fzrdh" min-width="80" placeholder="负责人电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="负责人身份证">
              <el-input v-model="searchPlace.fzrsfz" min-width="80" placeholder="负责人身份证" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="行业类型" prop="hylx">
              <el-select v-model="searchPlace.hylx" class="m-2" placeholder="请选择行业类型" size="large">
                <el-option
                  v-for="item in options"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="启用状态">
              <el-select v-model="searchPlace.qyzt" class="m-2" placeholder="请选择启用状态" size="large">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="区域" prop="deptId">
              <el-cascader
                v-model="searchPlace.deptId"
                style="width:100%"
                :options="deptOptions"
                :show-all-levels="false"
                :props="{ multiple:false,checkStrictly: true,label:'deptName',value:'deptId',disabled:'disabled',emitPath:false}"
                :clearable="false"
                placeholder="请选择查询区域"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
          <el-button
            class="excel-btn"
            size="small"
            type="primary"
            icon="download"
            @click="handleExcelExport"
          >按条件导出</el-button>

          <a style="margin-left:20px" href="http://117.159.44.7:18801/excel/module/工作人员信息模板.xlsx">
            <el-button class="btn" size="small" type="primary" icon="download">导入信息模板</el-button>
          </a>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button
          class="excel-btn"
          size="small"
          type="primary"
          icon="plus"
          @click="addPlace"
          :hidden="userStore.userInfo.authorities[0].authorityName === '场所管理员' "
        >新增</el-button>
      </div>
      <el-table :data="tableData" row-key="ID">
        <!-- <el-table-column align="left" label="记录ID" min-width="70" prop="cd_id" /> -->
        <el-table-column align="left" label="场所编号" min-width="230" prop="csbh" />
        <el-table-column
          align="left"
          label="场所名称"
          min-width="100"
          prop="csmc"
          show-overflow-tooltip
        />
        <el-table-column
          align="left"
          label="管理员账号"
          min-width="150"
          prop="user.userName"
          show-overflow-tooltip
        />
        <el-table-column align="left" label="行业类型" min-width="120" prop="industry.Name" />
        <el-table-column
          align="left"
          label="所属区县"
          min-width="80"
          prop="qx_name"
          show-overflow-tooltip
        />
        <el-table-column
          align="left"
          label="所属乡镇"
          min-width="90"
          prop="sq_name"
          show-overflow-tooltip
        />
        <el-table-column
          align="left"
          label="所属村"
          min-width="120"
          prop="jd_name"
          show-overflow-tooltip
        />
        <el-table-column
          align="left"
          label="详细地址"
          min-width="150"
          prop="xxdz"
          show-overflow-tooltip
        />
        <el-table-column align="left" label="启用状态" min-width="80" prop="qyzt">
          <template #default="scope">
            <el-switch
              v-model="scope.row.qyzt"
              :active-value="1"
              :inactive-value="0"
              @click="switchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column align="left" label="经度" min-width="80" prop="gldjd" />
        <el-table-column align="left" label="纬度" min-width="80" prop="gldwd" />-->
        <el-table-column align="left" label="负责人姓名" min-width="100" prop="fzrxm" />
        <el-table-column align="left" label="负责人电话" min-width="120" prop="fzrdh">
          <template v-slot:="scope">
            <el-popover trigger="hover" placement="top">
              <span style="margin-left: 30px;">{{ scope.row.fzrdh }}</span>
              <template #reference>
                <span>{{formatter(scope.row.fzrdh,3,4) }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="left" label="负责人身份证" min-width="170" prop="fzrsfz">
          <template v-slot:="scope">
            <el-popover trigger="hover" placement="top" width="170px">
              <span style="margin-left: 20px;">{{ scope.row.fzrsfz }}</span>
              <template #reference>
                <span>{{formatter(scope.row.fzrsfz,3,4) }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="申领单位"
          min-width="150"
          prop="fzrgzdw"
          show-overflow-tooltip
        />
        <el-table-column align="left" label="申领时间" min-width="220" prop="slsj">
          <template #default="scope">{{ formatDate(scope.row.slsj) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="130" fixed="right">
          <template #default="scope">
            <el-popover
              v-model:visible="scope.row.visible"
              trigger="click"
              placement="top"
              width="160"
            >
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
            <el-button type="text" icon="edit" size="small" @click="assignAdmin(scope.row)">分配管理员</el-button>
            <el-button type="text" icon="edit" size="small" @click="enterWorker(scope.row)">工作人员管理</el-button>
            <el-button
              :hidden="scope.row.industry.Name !== '隔离点'"
              type="text"
              icon="edit"
              size="small"
              @click="enterPeople(scope.row)"
            >隔离人员管理</el-button>
            <el-button
              :hidden="scope.row.industry.Name !== '隔离点'"
              type="text"
              icon="edit"
              size="small"
              @click="editPlaceRoome(scope.row)"
            >房间管理</el-button>
            <el-button
              :hidden="scope.row.industry.Name !== '工地'"
              type="text"
              icon="iphone"
              size="small"
              @click="scan(scope.row)"
            >扫码报备</el-button>
            <el-button type="text" icon="edit" size="small" @click="open(scope.row)">查看物联码</el-button>
            <!-- <el-button type="text" icon="edit" size="small"  @click="importExcel(scope.row)">导入</el-button> -->
            <el-upload
              class="excel-btn"
              v-model="excelUplod"
              :action="`${path}/file/upload`"
              :headers="{'x-token':userStore.token}"
              :on-change="(response,file,fileList)=> importExcel(response,scope.row, file,fileList)"
              :on-success="importApi2"
              :show-file-list="true"
            >
              <el-button type="text" icon="edit" size="small">导入</el-button>
            </el-upload>
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
      <el-dialog v-model="showCode" title="物联码" width="30%">
        <div class="placeName">{{ placeInfo.csmc }}</div>
        <div class="siteInfo">新乡市·{{ placeInfo.qx_name }}·{{ placeInfo.sq_name }}</div>
        <div class="codeDiv" style="padding-left: 13px;">
          <img style="width:100%;height:90%" :src="code.value " />
        </div>
      </el-dialog>

      <!-- 扫码报备 -->
      <el-dialog v-model="scanCode" title="扫码报备" width="30%">
        <div class="placeName">{{ placeInfo.csmc }}</div>
        <div class="siteInfo">新乡市·{{ placeInfo.qx_name }}·{{ placeInfo.sq_name }}</div>
        <div class="codeDiv" style="padding-left: 13px;">
          <img style="width:100%;height:90%" :src="reportCode.value " />
        </div>
      </el-dialog>

      <el-dialog
        v-model="addDialog"
        custom-class="user-dialog"
        title="场地管理"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div style="height:60vh;overflow:auto;padding:0 10px;">
          <el-form v-if="dialogFlag === 'add'" ref="placeForm" :rules="rules1" :model="placeInfo" label-width="110px">
            <el-form-item label="行业类型" prop="hylx_name">
              <el-select
                v-model="placeInfo.hylx_name"
                class="m-2"
                placeholder="请选择行业类型"
                size="large"
              >
                <el-option
                  v-for="item in options"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.Name"
                  @click="hylxSelect(item)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="场所名称" prop="csmc">
              <el-autocomplete
                  v-model="placeInfo.csmc"
                  :fetch-suggestions="querySearch"
                  clearable
                  placeholder="场所名称"
                  @select="handleSelect"
              />
            </el-form-item>
            <el-form-item label="所属区县" prop="qx_name">
              <el-input disabled="true" v-model="placeInfo.qx_name" />
            </el-form-item>
            <el-form-item label="所属乡镇" prop="sq_name">
              <el-input disabled="true" v-model="placeInfo.sq_name" />
            </el-form-item>
            <el-form-item label="所属村" prop="jd_name">
              <el-input disabled="true" v-model="placeInfo.jd_name" />
            </el-form-item>
            <el-form-item label="所属部门"  prop="deptId">
              <el-cascader
                placeholder=" "
                disabled="true"
                v-model="placeInfo.deptId"
                style="width:100%"
                :options="deptOptions"
                :show-all-levels="false"
                :props="{ multiple:false,checkStrictly: true,label:'deptName',value:'deptId',disabled:'disabled',emitPath:false}"
                :clearable="false"
              />
            </el-form-item>
            <el-form-item label="详细地址" prop="xxdz">
              <el-input disabled="true" v-model="placeInfo.xxdz" />
            </el-form-item>
            <el-form-item label="负责人姓名" prop="fzrxm">
              <el-input disabled="true" v-model="placeInfo.fzrxm" />
            </el-form-item>
            <el-form-item label="负责人电话" prop="fzrdh">
              <el-input disabled="true" v-model="placeInfo.fzrdh" />
            </el-form-item>
            <el-form-item label="负责人身份证" prop="fzrsfz">
              <el-input disabled="true" v-model="placeInfo.fzrsfz" />
            </el-form-item>
            <el-form-item label="申领单位" prop="fzrgzdw">
              <el-input disabled="true" v-model="placeInfo.fzrgzdw" />
            </el-form-item>
          </el-form>
          <el-form v-else ref="placeForm" :rules="rules2" :model="placeInfo" label-width="110px">
            <el-form-item label="行业类型" prop="hylx_name">
              <el-select
                v-model="placeInfo.hylx_name"
                class="m-2"
                placeholder="请选择行业类型"
                size="large"
              >
                <el-option
                  v-for="item in options"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.Name"
                  @click="hylxSelect(item)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="场所名称" prop="csmc">
              <el-autocomplete
                v-model="placeInfo.csmc"
                :fetch-suggestions="querySearch"
                clearable
                placeholder="场所名称"
                @select="handleSelect"
                @focus.once="handleInput"
              />
            </el-form-item>
            <el-form-item label="所属区县" prop="qx_name">
              <el-select
                v-model="placeInfo.qx"
                class="m-2"
                placeholder="请选择"
                size="large"
              >
                <el-option
                  v-for="item in qxList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  @click="qxSelect(item)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属乡镇" prop="sq_name">
              <el-select
                v-model="placeInfo.sq"
                class="m-2"
                placeholder="请选择"
                size="large"
              >
                <el-option
                  v-for="item in xzList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  @click="xzSelect(item)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属村" prop="jd_name">
              <el-select
                v-model="placeInfo.jd"
                class="m-2"
                placeholder="请选择"
                size="large"
              >
                <el-option
                  v-for="item in cunList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  @click="cunSelect(item)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属部门" placeholder="该项决定了场所的所属单位" prop="deptId">
              <el-cascader
                v-model="placeInfo.deptId"
                style="width:100%"
                :options="deptOptions"
                :show-all-levels="false"
                :props="{ multiple:false,checkStrictly: true,label:'deptName',value:'deptId',disabled:'disabled',emitPath:false}"
                :clearable="false"
              />
            </el-form-item>
            <el-form-item label="详细地址" prop="xxdz">
              <el-input v-model="placeInfo.xxdz" />
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
          </el-form>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button size="small" @click="closeAddDialog">取 消</el-button>
            <el-button size="small" type="primary" @click="enterAddDialog">确 定</el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog
        v-model="adminDialog"
        title="场所分配管理员"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div style="height:40vh;overflow:auto;padding:0 10px;">
          <warning-bar title="可选择分配已有账户，或者新增账户" />
          <el-form
            ref="placeAdminForm"
            :rules="placeAdminRules"
            :model="placeAdmin"
            label-width="110px"
          >
            <el-form-item label="账户类型" prop="placeAdminType">
              <el-select
                v-model="placeAdmin.placeAdminType"
                placeholder="请选择"
                prop="placeAdminType"
              >
                <el-option
                  v-for="item in placeAdminOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="管理员账号" prop="username">
              <el-input v-model="placeAdmin.username" />
            </el-form-item>
            <el-form-item v-if="placeAdmin.placeAdminType === '1'" label="管理员密码" prop="password">
              <el-input v-model="placeAdmin.password" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button size="small" @click="closeAdminDialog">取 消</el-button>
            <el-button size="small" type="primary" @click="enterAdminDialog">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "Place"
};
</script>

<script setup>
import {
  getPlaceList,
  setStatus,
  createPlace,
  setPlace,
  deletePlace,
  exportExcel,
  assignMannger,
  getBusinessMang,
  loadExcelData,
  getScanList
} from "@/api/place.js";

import { useUserStore } from "@/pinia/modules/user";

import { formatDate, formatter } from "@/utils/format";
import warningBar from "@/components/warningBar/warningBar.vue";
import { ref, toRaw, reactive} from "vue";
import { ElMessage } from "element-plus";
import json from "@/utils/address/xinxiang.json";
import vlgs from "@/utils/address/villages.json";
import { useRouter } from "vue-router";
import { debounce } from "@/utils/debounce.js";
import { defineComponent } from "vue";

const path = ref(import.meta.env.VITE_BASE_API);

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchPlace = ref({});

// 区和街道
const res = ref([]);
const areaValue = ref();
const streetValue = ref();
const qxList = ref([]);
const xzList = ref([]);
const cunList = ref([]);
const hylx = ref();
// 分页
const handleSizeChange = val => {
  pageSize.value = val;
  getTableData(retFind.value);
};

const handleCurrentChange = val => {
  page.value = val;
  getTableData(retFind.value);
};

// 查询
const getTableData = async value => {
  let rqt = { page: page.value, pageSize: pageSize.value };
  if (value) {
    rqt = { page: page.value, pageSize: pageSize.value, ...value };
  }
  const table = await getPlaceList(rqt);
  if (table.code === 0) {
    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};

const deptOptions = ref([]);
const setDeptOptions = deptData => {
  deptOptions.value = [];
  setDepartmentOptions(deptData, deptOptions.value);
};

const setDepartmentOptions = (DeptData, optionsData) => {
  DeptData &&
    DeptData.forEach(item => {
      if (item.children && item.children.length) {
        const option = {
          deptId: item.deptId,
          deptName: item.name,
          children: []
        };
        setDepartmentOptions(item.children, option.children);
        optionsData.push(option);
      } else {
        const option = {
          deptId: item.deptId,
          deptName: item.name
        };
        optionsData.push(option);
      }
    });
};

// 分派管理类型
const placeAdminOptions = [
  { label: "使用已有账户", value: "0" },
  { label: "新增账户", value: "1" }
];

// 行业类型
const options = ref([]);
const getBusinessList = async () => {
  const { data } = await getBusinessMang({ page: 1, pageSize: 200 });

  options.value = data.list;
  //console.log(options.value);
};
getBusinessList();
const getRes = async () => {
  const test = json.children;
  var ans = [];
  var children = [];
  for (let i = 0; i < test.length; i++) {
    for (let j = 0; j < test[i].children.length; j++) {
      children[j] = {
        value: test[i].children[j].code,
        label: test[i].children[j].name
      };
    }
    ans[i] = { value: test[i].code, label: test[i].name, children: children };
    children = [];
  }
  res.value = ans;
};

const retFind = ref({});
// 搜索
const onSubmit = debounce(() => {
  getRetFind();
  getTableData(retFind.value);
});
const getRetFind = () => {
  retFind.value = toRaw(searchPlace.value);
};
const onReset = () => {
  searchPlace.value = {};
  getTableData();
};

const initPage = async () => {
  getTableData();
  // getRes()
  const depTs = [];
  depTs.push(json);
  setDeptOptions(depTs);
  qxList.value = json.children;
};

initPage();

const switchChange = async row => {
  const resStatus = await setStatus({ id: row.id, status: row.qyzt });
  if (resStatus.code === 0) {
    ElMessage.success("修改成功");
  }
};

// 弹窗模糊查询
const searchQuery = reactive({
  place_name: ""
});

const getDialogData = async () => {
  const data = (await getScanList(searchQuery)).data.list;
  const {
    detail_address,
    district_code,
    district_name,
    place_name,
    principal_id_card,
    principal_name,
    principal_phone,
    street_code,
    street_name,
    township_code,
    township_name,
    dept_id,
    unit_name
  } = data[0];
    placeInfo.value.qx = district_code
    placeInfo.value.qx_name = district_name
    placeInfo.value.sq = township_code
    placeInfo.value.sq_name = township_name
    placeInfo.value.jd = street_code
    placeInfo.value.jd_name = street_name
    placeInfo.value.xxdz = detail_address
    placeInfo.value.fzrxm = principal_name
    placeInfo.value.fzrdh = principal_phone
    placeInfo.value.fzrsfz = principal_id_card
    placeInfo.value.deptId = Number(dept_id)
    placeInfo.value.fzrgzdw = unit_name
};
const placeList = ref([]);

const querySearch = async(queryString, cb) => {
  const params = {
    place_name: queryString,
    page: 1,
    pageSize: 10
  }
  placeList.value = (await getScanList(params)).data.list.map((iterm) => {
    let res = {}
    res.value = iterm.place_name
    return res
  })
  
  console.log(placeList.value)
  cb(placeList.value);
};

const createFilter = queryString => {
  return restaurant => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

const handleSelect = item => {
  searchQuery.place_name = item.value;
  getDialogData();
};

const handleInput = async value => {
  // 表格数据
  placeList.value = (await getScanList(value)).data.List.map(item => {
    let res = {};
    res.value = item.place_name;
    return res;
  });
};

// 弹窗
const addDialog = ref(false);
const closeAddDialog = () => {
  // 置空
  clearForm();
  addDialog.value = false;
};
const placeAdminForm = ref(null);
const adminDialog = ref(false);
const closeAdminDialog = () => {
  // 置空
  placeAdminForm.value.resetFields();
  placeAdmin.value.username = "";
  placeAdmin.value.placeId = "";
  adminDialog.value = false;
};
const clearForm = () => {
  placeForm.value.resetFields();
  placeInfo.value = {
    csmc: "",
    qx: "",
    qx_name: "",
    sq: "",
    sq_name: "",
    jd: "",
    jd_name: "",
    xxdz: "",
    qyzt: 0,
    gldjd: "",
    gldwd: "",
    fzrxm: "",
    fzrdh: "",
    fzrsfz: "",
    fzrgzdw: "",
    hylx_name: "",
    hylx: null
  };
};

const dialogFlag = ref("add");

// 新增
const addPlace = () => {
  dialogFlag.value = "add";
  addDialog.value = true;
};
// 删除
const deletePlaceFun = async row => {
  const res = await deletePlace({ id: row.id });
  if (res.code === 0) {
    ElMessage.success("删除成功");
    row.visible = false;
    await getTableData();
  }
};

// 弹窗
const placeInfo = ref({
  csmc: "",
  qx: "",
  qx_name: "",
  sq: "",
  sq_name: "",
  jd: "",
  jd_name: "",
  xxdz: "",
  qyzt: 0,
  gldjd: "",
  gldwd: "",
  fzrxm: "",
  fzrdh: "",
  fzrsfz: "",
  fzrgzdw: "",
  hylx_name: "",
  hylx: null,
  deptId: ""
});

// 分配管理员弹窗
const placeAdmin = ref({
  username: "",
  placeId: "",
  password: "",
  placeAdminType: "0"
});

const placeAdminRules = ref({
  username: [{ required: true, message: "请输入管理员账号", trigger: "blur" }],
  placeId: [{ required: true, message: "请传输场所id", trigger: "blur" }],
  password: [{ required: true, message: "请输入管理员密码", trigger: "blur" }],
  placeAdminType: [
    { required: true, message: "请选择分配方式", trigger: "blur" }
  ]
});

const rules1 = ref({
  csmc: [{ required: true, message: "请输入场合名称", trigger: "blur" }],
  hylx_name: [{ required: true, message: "请选择行业类型" }],
});
const rules2 = ref({
  csmc: [{ required: true, message: "请输入场合名称", trigger: "blur" }],
  hylx_name: [{ required: true, message: "请选择行业类型" }],
  xxdz: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
  fzrxm: [
    { required: true, message: "请输入负责人姓名", trigger: "blur" },
    { min: 1, max: 5, message: "不合要求", trigger: "blur" }
  ],
  fzrdh: [
    { required: true, message: "请输入负责人电话", trigger: "blur" },
    // 正则
    {
      pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: "手机号不合法",
      trigger: "blur"
    }
  ],
  fzrsfz: [
    { required: true, message: "请输入负责人身份证", trigger: "blur" },
    // 正则
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: "身份证号不合法",
      trigger: "blur"
    }
  ],
  fzrgzdw: [
    { required: true, message: "请输入申领单位", trigger: "blur" }
    // { min: 2, message: '最低2位字符', trigger: 'blur' },
  ],
  
  qx_name: [{ required: true, message: "请选择区县" }],
  sq_name: [{ required: true, message: "请选择乡镇" }],
  jd_name: [{ required: true, message: "请选择该项" }],
  deptId: [{ required: true, message: "该项决定了场所的所属单位" }]
});

const placeForm = ref(null);

// 修改
const editPlace = row => {
  placeInfo.value = JSON.parse(JSON.stringify(row));
  placeInfo.value.hylx_name = row.industry.Name;
  // placeInfo.value.qx_name = row.qx_name
  getXzList(row.qx);
  // placeInfo.value.sq_name = row.sq_name
  getCunList(row.sq);
  // placeInfo.value.jd_name = row.jd_name
  qx_name.value = row.qx_name;
  sq_name.value = row.sq_name;
  jd_name.value = row.jd_name;
  hylx.value = Number(row.hylx);
  dialogFlag.value = "edit";
  addDialog.value = true;
  
};

// 修改
const assignAdmin = row => {
  adminDialog.value = true;
  placeAdmin.value.placeId = row.id;
  placeAdmin.value.username = row.user.userName;
};

const router = useRouter();
// 跳转工作人员管理
const enterWorker = row => {
  router.push({
    name: "worker",
    params: {
      csbh: row.csbh
    }
  });
};

// 报备地址复制
//  const { toClipboard } = useClipboard()
// const copyAddress=async (row)=>{
//   placeInfo.value = JSON.parse(JSON.stringify(row))
// try {
//   await toClipboard( 'http://117.159.44.7:18801/#/vehicleMidPage?csbh='+ placeInfo.value.csbh)
//   ElMessage({ type: 'success', message: '复制成功' })
// } catch (e) {
//   ElMessage.error('复制失败')
// }

//   return {copyAddress}
// }

// 扫码报备
const scanCode = ref(false);
const reportCode = {};
const scan = row => {
  placeInfo.value = JSON.parse(JSON.stringify(row));
  qx_name.value = row.qx_name;
  scanCode.value = !scanCode.value;
  reportCode.value =
    import.meta.env.VITE_BASE_API +
    "/cd/reporting_Address_Code?csbh=" +
    row.csbh;
};

// 物联码
const showCode = ref(false);
const code = {};
const open = row => {
  placeInfo.value = JSON.parse(JSON.stringify(row));
  qx_name.value = row.qx_name;
  showCode.value = !showCode.value;
  code.value = import.meta.env.VITE_BASE_API + "/cd/code?csbh=" + row.csbh;
};

// 导入
const userStore = useUserStore();
const reqFileId = {};
const importExcel = async (file, row, other, fileList) => {
  reqFileId.value = {
    file_name: file.name,
    place_id: row.csbh
  };
};

const importApi2 = async res => {
  let key = res.data.file.key;
  if (res.code === 0) {
    reqFileId.value.file_name = key;
    const res = await loadExcelData(reqFileId.value);
  } else if (res.code === 7) {
    ElMessage({ type: "err", message: "导入失败" });
  }
};

// 跳转隔离人员管理
const enterPeople = row => {
  router.push({
    name: "quarantinedPersonManag",
    params: {
      csbh: row.csbh
    }
  });
};

// 跳转房间管理
const editPlaceRoome = row => {
  router.push({
    name: "placeRoom",
    params: {
      PlaceID: row.csbh
    }
  });
};

// 确认增加修改
const enterAddDialog = async () => {
  placeForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...placeInfo.value
      };
      req.hylx = hylx.value;
      
      // 新增
      if (dialogFlag.value === "add") {
        const res = await createPlace(req);
        if (res.code === 0) {
          ElMessage({ type: "success", message: "创建成功" });
          await getTableData(retFind.value);
          closeAddDialog();
        }
      }
      // 修改
      if (dialogFlag.value === "edit") {
        req.qx_name = qx_name.value;
        req.sq_name = sq_name.value;
        req.jd_name = jd_name.value;
        const res = await setPlace(req);
        if (res.code === 0) {
          ElMessage({ type: "success", message: "编辑成功" });
          await getTableData(retFind.value);
          closeAddDialog();
        }
      }
    }
  });
};

const enterAdminDialog = async () => {
  placeAdminForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...placeAdmin.value
      };
      const res = await assignMannger(req);
      if (res.code === 0) {
        ElMessage({ type: "success", message: "创建成功" });
        await getTableData(retFind.value);
        closeAdminDialog();
      }
    }
  });
};

// 级联切换区/街道
const handleChange = value => {
  areaValue.value = value[0];
  streetValue.value = value[1];

  // 获取村选项列表
  const list = [];
  for (let i = 0; i < vlgs.length; i++) {
    if (vlgs[i].streetCode == streetValue.value) {
      let temp = {};
      temp = { value: vlgs[i].code, label: vlgs[i].name };
      list.push(temp);
    }
  }
  cunList.value = list;
};

const qx_name = ref("");
const sq_name = ref("");
const jd_name = ref("");
const qxSelect = item => {
  qx_name.value = item.name;
  getXzList(item.code);
};
const getXzList = async code => {
  const qus = json.children;
  for (let i = 0; i < qus.length; i++) {
    if (qus[i].code == code) {
      xzList.value = qus[i].children;
    }
  }
};
const xzSelect = item => {
  sq_name.value = item.name;
  getCunList(item.code);
};
const getCunList = async code => {
  const list = [];
  for (let i = 0; i < vlgs.length; i++) {
    if (vlgs[i].streetCode == code) {
      list.push(vlgs[i]);
    }
  }
  cunList.value = list;
};
const cunSelect = item => {
  jd_name.value = item.name;
};
const hylxSelect = item => {
  hylx.value = item.ID;
};

// 导出
const handleExcelExport = debounce(() => {
  getRetFind();
  getExcel("cd_export.xlsx");
});

const getExcel = fileName => {
  // if (!fileName || typeof fileName !== 'string') {
  //   fileName = 'cd_export.xlsx'
  // }
  exportExcel({ fileName, ...retFind.value });
};
</script>


<style lang="scss">
.excel-btn + .excel-btn {
  margin-left: 10px;
}

.placeName {
  font-size: 4vh;
  color: rgb(198, 136, 29);
  margin: 1vh;
  margin-bottom: 2vh;
  text-align: center;
}
/* 省市区 */
.siteInfo {
  color: rgb(198, 136, 29);
  font-size: 3vh;
  text-align: center;
}
.admin-box .el-input__inner {
  line-height: 1rem !important;
}

.el-row {
  padding: 0 !important;
}
</style>
