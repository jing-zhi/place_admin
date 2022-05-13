<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchWorker" style="margin-left:20px">
          <el-form-item v-show="csbh==''" label="场所编号" prop="csbh">
            <el-input v-model="searchWorker.csbh"   placeholder="场所编号" />
          </el-form-item>
          <el-form-item v-show="csbh==''" label="场所名称" prop="csmc">
            <el-input v-model="searchWorker.csmc"   placeholder="场所名称" />
          </el-form-item> 

          <el-form-item label="姓名">
            <el-input v-model="searchWorker.gzryxm" min-width="50" placeholder="工作人员姓名" />
          </el-form-item>  
          <el-form-item label="手机号">
            <el-input v-model="searchWorker.gzrysjh" min-width="80" placeholder="工作人员手机号" />
          </el-form-item>    
          <el-form-item label="身份证">
            <el-input v-model="searchWorker.gzrysfz" min-width="80" placeholder="工作人员身份证" />
          </el-form-item>  

          <el-form-item label="状态">
            <el-select v-model="searchWorker.zt" class="m-2" placeholder="请选择人员状态" size="large">
              <el-option
                v-for="item in ztList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                 @click="ztSearch(item)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入职时间范围">
              <el-date-picker
                    v-model="searchWorker.rz"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
          </el-form-item>      
          <el-form-item label="调离时间范围">
              <el-date-picker
                    v-model="searchWorker.dl"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
          </el-form-item>      
          <el-form-item>
            <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
            <el-button size="small" icon="refresh" @click="onReset">重置</el-button>

            <el-button class="excel-btn" size="small" type="primary" icon="download" @click="handleExcelExport('cdWorker_export.xlsx')">按条件导出</el-button>

          </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button class="excel-btn" size="small" type="primary" icon="plus" @click="addWorker">新增</el-button>  
      </div>
      <div class="gva-btn-list"></div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <!-- <el-table-column align="left" label="id" min-width="70" prop="id" /> -->
        <el-table-column align="left" label="场所编号" min-width="120" prop="csbh" />
        <el-table-column align="left" label="场所名称" min-width="120" prop="CdJoin.csmc" />
        <el-table-column align="left" label="工作人员姓名" min-width="120" prop="gzryxm" />
        <el-table-column align="left" label="工作人员手机号" min-width="150" prop="gzrysjh" />
        <el-table-column align="left" label="身份证号" min-width="150" prop="gzrysfz" />
        <el-table-column align="left" label="所在地市" min-width="100" prop="gzrdsname" />
        <el-table-column align="left" label="所在县区" min-width="100" prop="gzrqxname"/>
        <el-table-column align="left" label="所在乡" min-width="100" prop="gzrxzname"/>        
        <el-table-column align="left" label="原工作单位" min-width="100" prop="ydw" />
        <el-table-column align="left" label="隔离点职务" min-width="100" prop="gldzw" />
        <el-table-column align="left" label="工作人员类别" min-width="120" prop="gldgw" />
        <el-table-column align="left" label="入职隔离点日期" min-width="140" prop="rzrq" />
        <el-table-column align="left" label="人员状态" min-width="80" prop="zt" />
        <!-- <el-table-column align="left" label="调离时间" min-width="120" prop="sj.Time" /> -->
        <el-table-column align="left" label="调离时间" min-width="120" prop="sj.Time">
          <template #default="scope">
            {{tableData.sj = scope.row.sj.Valid?scope.row.sj.Time:''}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="调离隔离点编号" min-width="150" prop="dlgldbh" />
        <el-table-column label="操作" min-width="150" fixed="right">
          <template #default="scope">
            <el-popover v-model:visible="scope.row.visible" placement="top" width="100">
              <p>确定要删除此用户吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="deleteWorkerFun(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button type="text" icon="delete" size="small">删除</el-button>
              </template>
            </el-popover>
            <el-button type="text" icon="edit" size="small" @click="openEdit(scope.row)">编辑</el-button>       
            <el-button type="text" icon="edit" size="small" @click="openDetails(scope.row)">查看扫码详情</el-button>       

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
        title="工作人员管理"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
      <div style="height:60vh;overflow:auto;padding:0 10px;">
        <el-form ref="workerForm"  :rules="rules" :model="workerInfo" label-width="130px">
          <el-form-item v-if="dialogFlag === 'add'" label="场所编号" prop="csbh">
            <el-input v-model="csbh"   placeholder="场所编号" />
          </el-form-item>
          <el-form-item label="工作人员姓名" prop="gzryxm">
            <el-input v-model="workerInfo.gzryxm" />
          </el-form-item>
          <el-form-item label="工作人员手机号" prop="gzrysjh">
            <el-input v-model="workerInfo.gzrysjh" />
          </el-form-item>
          <el-form-item label="工作人员身份证" prop="gzrysfz">
            <el-input v-model="workerInfo.gzrysfz" />
          </el-form-item>
          <el-form-item label="地市" prop="gzrds">
            <el-select v-model="workerInfo.gzrds" class="m-2" placeholder="请选择" size="large">
              <el-option
                v-for="item in dsList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
                @click="dsSelect(item)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区县" prop="gzrqx">
            <el-select v-model="workerInfo.gzrqx" class="m-2" placeholder="请选择" size="large">
              <el-option
                v-for="item in qxList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
                 @click="qxSelect(item)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="乡镇" prop="gzrxz">
            <el-select v-model="workerInfo.gzrxz" class="m-2" placeholder="请选择" size="large">
              <el-option
                v-for="item in xzList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
                @click="xzSelect(item)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="原单位" prop="ydw">
            <el-input v-model="workerInfo.ydw" />
          </el-form-item>
          <el-form-item label="职务" prop="gldzw">
            <el-select v-model="workerInfo.gldzw" class="m-2" placeholder="请选择" size="large">
              <el-option
                v-for="item in zwList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                 @click="zwSelect(item)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="类别" prop="gldgw">
            <el-select v-model="workerInfo.gldgw" class="m-2" placeholder="请选择" size="large">
              <el-option
                v-for="item in gwList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                 @click="gwSelect(item)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入职隔离点日期" prop="rzrq">
            <!-- <el-input v-model="workerInfo.rzrq" /> -->
            <el-date-picker v-model="workerInfo.rzrq" type="date" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="状态" prop="zt">
            <el-select v-model="workerInfo.zt" class="m-2" placeholder="请选择" size="large">
              <el-option
                v-for="item in ztList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                 @click="ztSelect(item)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="调离时间" prop="sj">
            <el-date-picker v-model="workerInfo.sj" type="date" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="调离隔离点编号" prop="dlgldbh">
            <el-input v-model="workerInfo.dlgldbh" />
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

    </div>
  </div>
</template>

<script>
export default {
  name: 'Worker',
}
</script>

<script setup>
import {
  getWorkerList,
  deleteWorker,
  createWorker,
  setWorker
} from '@/api/csUser/worker.js'

import { exportExcel, loadExcelData, downloadTemplate } from '@/api/excel'
import { nextTick, ref, watch ,toRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dsData from '@/utils/address/ds.json'
// import qxData from '@/utils/address/areas.json'
// import xzData from '@/utils/address/streets.json'
import vlgs from '@/utils/address/jlhenan.json'

import {formatTimeToStr} from '@/utils/date.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const csbh = ref('')
csbh.value = route.params.csbh ? route.params.csbh : ''

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchWorker = ref({})
// 地址
const dsList = ref([])
const qxList = ref([])
const xzList = ref([])
const zwList = [
    {id:1,name:"点长"},
    {id:2,name:"基层干部"},
    {id:3,name:"公安人员"},
    {id:4,name:"交通人员"},
    {id:5,name:"感控人员"},
    {id:6,name:"医务人员"},
] //1:点长,2:基层干部,3:公安人员,4:交通人员,5:感控人员,6:医务人员
const gwList = [
    {id:1,name:"负责人"},
    {id:2,name:"医务人员"},
    {id:3,name:"信息联络员"},
    {id:4,name:"清洁消毒员"},
    {id:5,name:"安全保障员"},
    {id:6,name:"后勤保障员"},
    {id:7,name:"心理辅导员"},
    {id:8,name:"污水处理设施管理员"},
] //负责人，医务人员，信息联络员，清洁消毒员，安全保障员，后勤保障员，心理辅导员，污水处理设施管理员
const ztList = [
    {id:1,name:"在岗"},
    {id:2,name:"离岗"},
    {id:3,name:"调离"},
    {id:4,name:"正常隔离"},
] //1在岗 2离岗 3调离  4 正常隔离

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
    let rqt = { csbh:csbh.value, page: page.value, pageSize: pageSize.value }
    if(value) {
        rqt = { csbh:csbh.value, page: page.value, pageSize: pageSize.value, ...value }   
    } 
    console.log(rqt);
    const table = await getWorkerList(rqt)
    if (table.code === 0) {
        tableData.value = table.data.list
        total.value = table.data.total
        page.value = table.data.page
        pageSize.value = table.data.pageSize
    } 
}

const find = ref({})
// 搜索
const onSubmit = async() => {
    let retFind = toRaw(searchWorker.value)
    if(searchWorker.value.rz) {
      retFind.start_time = searchWorker.value.rz[0]
      retFind.end_time = searchWorker.value.rz[1]
      // delete retFind.rz
    }
    if(searchWorker.value.dl) {
        retFind.transfer_start_time = searchWorker.value.dl[0]
        retFind.transfer_end_time = searchWorker.value.dl[1]
      //  delete retFind.dl
    }
    // let resFind = {   
    //     gzrysfz: "",
    //     gzrysjh: "",
    //     gzryxm: "",
    //     zt: "",
    //     ztid: null,
    //     start_time: null,
    //     end_time:null,
    //     transfer_start_time:null,
    //     transfer_end_time:null
    // }
    //console.log(resFind)
    console.log(toRaw(searchWorker.value));
    //console.log(searchWorker.value)
    find.value = retFind
    getTableData(retFind)
}
const onReset = () => {
  searchWorker.value = {}
  getTableData()
}


const initPage = async() => {
    getTableData()
    dsList.value = dsData;
    console.log(csbh.value);
}

initPage()


// 弹窗
const addDialog = ref(false)
const closeAddDialog = () => {
  //workerForm.value.resetFields()
  // 置空
  clearForm()
  addDialog.value = false
}
const dialogFlag = ref('add')

// 新增
const addWorker = () => {
  dialogFlag.value = 'add'
  addDialog.value = true
}
// 删除
const deleteWorkerFun = async(row) => {
  console.log(row.id)
  const res = await deleteWorker({ id: row.id })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      row.visible = false
      await getTableData()
    }
}

// 弹窗
const workerInfo = ref({
    //"id":1,//id主键id
    //"csbh":"",//csbh隔离点编号
    "gzryxm": "",    //gzryxm工作人员姓名
    "gzrysjh": "",    //gzrysjh工作人员手机号
    "gzrysfz": "",    //gzrysfz身份证号
    "gzrds": null,    //gzrds人员原单位所在地市编码
    "gzrqx": null,    //gzrqx人员所在县区编码
    "gzrxz": null,    //gzrxz人员所在乡编码
    "ydw": "",    //ydw原工作单位
    "gldzw": "",    //gldzw隔离点职务（1:点长,2:基层干部,3:公安人员,4:交通人员,5:感控人员,6:医务人员）
    "gldgw": "",    //gldgw工作人员类别：负责人，医务人员，信息联络员，清洁消毒员，安全保障员，后勤保障员，心理辅导员，污水处理设施管理员。共八种
    "rzrq": "",    //rzrq入职隔离点日期
    "zt": "",    //zt人员状态（1在岗 2离岗 3调离  4 正常隔离）
    //"sj": "",    //sj 调离时间
    //"sj": new Date(),
    "dlgldbh": "",    //dlgldbh 调离隔离点编号
})
//const rules = ref({})

const rules = ref({
  gzryxm: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 1, max:5, message: '不合要求', trigger: 'blur' },
  ],
  gzrysjh: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1(3|4|5|7|8|9)\d{9}$/,
        message: '手机号不合法' ,
        trigger: 'blur'},
    //{ type: 'number', message: 'must be a number' },
    // 正则
  ],
  gzrysfz: [
    { required: true, message: '请输入身份证', trigger: 'blur' },
    // 正则
    { pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
        message: '身份证号不合法' ,
        trigger: 'blur'}
  ],
  gzrds:[
    { required: true, message: '请选择地市' },
  ],
  gzrqx:[
    { required: true, message: '请选择区县' },
  ],
  gzrxz:[
    { required: true, message: '请选择乡镇' },
  ],
  // 地区
  ydw: [
    { required: true, message: '请输入原单位', trigger: 'blur' },
    { min: 2, message: '最低2位字符', trigger: 'blur' }, 
  ],
  //zw gw

  gldgw: [
    { required: true, message: '请选择人员类别' },
  ],
  rzrq: [
    { required: true, message: '请输入入职日期', trigger: 'blur' }
  ],
  zt: [
    { required: true, message: '请选择人员状态' }
  ]
})

const workerForm = ref(null)
const clearForm = () => {
  workerForm.value.resetFields()
  workerInfo.value = {
    //"csbh":"",//csbh隔离点编号
    "gzryxm": "",    //gzryxm工作人员姓名
    "gzrysjh": "",    //gzrysjh工作人员手机号
    "gzrysfz": "",    //gzrysfz身份证号
    "gzrds": null,    //gzrds人员原单位所在地市编码
    "gzrqx": null,    //gzrqx人员所在县区编码
    "gzrxz": null,    //gzrxz人员所在乡编码
    "ydw": "",    //ydw原工作单位
    "gldzw": "",    //gldzw隔离点职务（1:点长,2:基层干部,3:公安人员,4:交通人员,5:感控人员,6:医务人员）
    "gldgw": "",    //gldgw工作人员类别：负责人，医务人员，信息联络员，清洁消毒员，安全保障员，后勤保障员，心理辅导员，污水处理设施管理员。共八种
    "rzrq": "",    //rzrq入职隔离点日期
    "zt": "",    //zt人员状态（1在岗 2离岗 3调离  4 正常隔离）
    "sj": "",    //sj 调离时间
    "dlgldbh": "" //dlgldbh 调离隔离点编号
  }
}
// 打开修改
const openEdit = (row) => {
    console.log(row.id);
    // console.log(row.value);
    workerInfo.value = JSON.parse(JSON.stringify(row))
    //workerInfo.value.gzrds = row.gzrds
    getqxList(row.gzrds)
    //workerInfo.value.gzrqx = row.gzrqx
    getxzList(row.gzrqx)
    //workerInfo.value.gzrxz = row.gzrxz
    workerInfo.value.sj = row.sj.Valid?workerInfo.value.sj.Time:'';
    if(workerInfo.value.sj == '') delete workerInfo.value.sj 
    //workerInfo.value.sj = row.sj.Time
    console.log(workerInfo.value);
//   const res = await getApiById({ id: row.id })
//   form.value = res.data.api

  dialogFlag.value = 'edit'
  addDialog.value = true
}

// 确认增加修改
const enterAddDialog = async() => {
  workerForm.value.validate(async valid => {
    if (valid) {

      const req = {
        ...workerInfo.value,
      }
      //console.log(req)
      let request = req;
      //request.csbh = "084107030070091651747871";
      request.csbh = csbh.value;
    //   request.gzrdsname =dsname.value;
    //   request.gzrqxname =qxname.value;
    //   request.gzrxzname =xzname.value;
     // request.sj = formatTimeToStr(request.sj)
      //console.log(request.sj)
      request.gldzwid =zwid.value;
      request.gldgwid =gwid.value;
      request.ztid =ztid.value;
      //tableData.sj = scope.row.sj.Valid?tableData.sj.Time:'';
      console.log(request)

      // 新增
      if (dialogFlag.value === 'add') {
        console.log("add")
        const res = await createWorker(request)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddDialog()
        }
      }
      // 修改
      if (dialogFlag.value === 'edit') {
        console.log("edit")
        const res = await setWorker(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddDialog()
        }
      }

    }
  })

}

// 跳转详情
const router = useRouter()
const openDetails = (row) => {
  console.log(row.id);
  router.push({
    name: 'workerclock',
    params: {
      'pid': row.id
    }
  })
}


// 市 区 镇
// const dsname = ref("")
// const qxname = ref("")
// const xzname = ref("")
const dsSelect = (item) => {
  console.log(item.code);
  workerInfo.value.gzrdsname = item.name
  //dsname.value = item.name
  //获取区县列表
  getqxList(item.code)
  workerInfo.value.gzrqx = null
  workerInfo.value.gzrxz = null
  
}
const getqxList = async(code) => {
    for (let i = 0; i < vlgs.length; i++) {
    if (vlgs[i].code == code) {
        qxList.value = vlgs[i].children 
        console.log(qxList.value);
    }
  }
}
const qxSelect = (item) => {
  console.log(item.code);
  //qxname.value = item.name
  workerInfo.value.gzrqxname = item.name
  //获取乡镇列表
  getxzList(item.code)
  workerInfo.value.gzrxz = null
   
}
const getxzList = async(code) => {
    for (let i = 0; i < qxList.value.length; i++) {
        if(qxList.value[i].code==code) {
            //let list = toRaw(qxList.value[i].children)
            let list = qxList.value[i].children
            console.log(list);
            xzList.value = list
            //return list;
        }   
    }
}
const xzSelect = (item) => {
  console.log(item);
  //xzname.value = item.name
  workerInfo.value.gzrxzname = item.name
}

const zwid = ref(1)
const gwid = ref(1)
const ztid = ref(1)
//职位
const zwSelect = (item) => {
  console.log(item);
  zwid.value = item.id;
}
// 岗位
const gwSelect = (item) => {
  console.log(item);
  gwid.value = item.id;
}
//状态
const ztSelect = (item) => {
  //console.log(item);
  ztid.value = item.id;
}

const ztSearch = (item) => {
    console.log("搜索"+item.name);
    searchWorker.value.ztid = item.id
    //console.log(searchWorker);
}


// 导出
const handleExcelExport = (fileName) => {
  if (!fileName || typeof fileName !== 'string') {
    fileName = 'cdWorker_export.xlsx'
  }
  exportExcel(tableData.value, fileName)

  onSubmit()
  console.log(find.value)
  exportExcel(find.value, fileName)
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
