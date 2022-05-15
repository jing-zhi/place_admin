<template>
  <!-- 新增修改 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="dialogTitle"
    :show-close="true"
    :before-close="closeDialog"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-width="140px">
     
      <el-row>
         <el-col :span="12">
          <el-form-item label="场所编号" prop="csbh" label-width="140px">
            <el-input
              
              style="width: 100%"
              v-model="form.csbh"
              placeholder="请输入场所编号"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="隔离人员姓名" prop="glryxm">
            <el-input
              v-model="form.glryxm"
              placeholder="请输入姓名"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="人员类别" label-width="140px" prop="rylb">
            <el-select
            placement="bottom"
              v-model="form.rylb"
              class="m-2"
              placeholder="请选择"
              size="large"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in rylbList"
                :key="item.index"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否非法入境人员"
            label-width="140px"
            prop="sfffrjry"
          >
            <el-select
              v-model="form.sfffrjry"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option value="2" label="否" />
              <el-option value="1" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国籍" label-width="140px" prop="gj">
            <el-select
              v-model="form.gj"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in gjList"
                :key="index"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入境航班号" prop="rjhbh" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.rjhbh"
              placeholder="请输入入境航班号"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入境证件类型" prop="rjzjlx" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.rjzjlx"
              placeholder="请输入入境证件类型"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
         
        <el-col :span="12">
          <el-form-item label="入境证件号码" prop="rjzjhm" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.rjzjhm"
              placeholder="请输入入境证件号码"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件类型" prop="zjlx" label-width="140px">
            <el-select
              @change="selectClickHandler(form.zjlx)"
              v-model="form.zjlx"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in zjlxList"
                :key="index"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码" prop="zjhm" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.zjhm"
              placeholder="请输入证件号码"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="sjhm" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.sjhm"
              placeholder="请输入手机号码"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="隔离点房间编号"
            prop="gldfjbh"
            label-width="140px"
          >
            <el-select
              :style="{ width: '100%' }"
              v-model="form.gldfjbh"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in roomList"
                :key="item.ID"
                :label="
                  item.BuildingNumber +
                  '栋' +
                  item.FloorNumber +
                  '层' +
                  item.RoomNumber +
                  '房间'
                "
                :value="item.ID"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="同住人姓名" prop="tzrxm" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.tzrxm"
              placeholder="请输入同住人姓名"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="隔离开始时间" prop="glkssj" label-width="140px">
            <el-date-picker
              style="width: 100%"
              v-model="form.glkssj"
              type="date"
              placeholder="隔离开始时间"
              :disable="disable"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="预计解除隔离时间"
            prop="yjjcglrq"
            label-width="140px"
          >
            <el-date-picker
              style="width: 100%"
              v-model="form.yjjcglrq"
              type="date"
              placeholder="预计解除隔离时间"
              :disable="disable"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="隔离结束时间" prop="gljssj" label-width="140px">
            <el-date-picker
              style="width: 100%"
              v-model="form.gljssj"
              type="date"
              placeholder="隔离结束时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否接种疫苗" prop="sfjzym" label-width="140px">
            <el-select
              v-model="form.sfjzym"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option value="2" label="否" />
              <el-option value="1" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否阳性" prop="sfyx" label-width="140px">
            <el-select
              v-model="form.sfyx"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option value="2" label="否" />
              <el-option value="1" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="意向去向城市" prop="yxqxcs" label-width="140px">
            <el-select
              filterable
              v-model="form.yxqxcs"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in cityList"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="意向去向县区" prop="yxqxxq" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.yxqxxq"
              placeholder="请输入意向去向县区"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="意向去向地址" prop="yxqxdz" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.yxqxdz"
              placeholder="请输意向去向地址"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="隔离状态" prop="glzt" label-width="140px">
            <el-select
              filterable
              v-model="form.glzt"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in QglztList"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="转出时间" prop="zcsj" label-width="140px">
            <el-date-picker
              style="width: 100%"
              v-model="form.zcsj"
              type="date"
              placeholder="转出时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="转出地点" prop="zcdd" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.zcdd"
              placeholder="请输入转出地点"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接收人员姓名" prop="jsryxm" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.jsryxm"
              placeholder="请输入接收人员姓名"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="转出原因" prop="zcyy" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.zcyy"
              placeholder="请输入转出原因"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="bz" label-width="140px">
            <el-input
              style="width: 100%"
              v-model="form.bz"
              placeholder="备注信息"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="closeDialog">取 消</el-button>
        <el-button size="small" type="primary" @click="enterDialog"
          >确 定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import {
  addData,
  getData,
  singleDelete,
  updateData,
  getRoomList,
} from "@/api/quarantinedPersonManag";
import { defineProps, ref, reactive, inject, nextTick, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Qform,
  QrylbList,
  QgjList,
  QzjlxList,
  QcityList,
  QglztList,
} from "../../../data/quarantined";

//父组件方法
const dialogFormVisibleShow = inject("dialogFormVisibleShow");
const reGetData = inject("reGetData");
//参数
const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false,
  },
  dialogTitle: {
    type: String,
    default: "",
  },
  csbh: {
    type: String,
    default: "",
  },
});

let roomList = ref([]);
const rylbList = QrylbList;
const gjList = QgjList;
const zjlxList = QzjlxList;
const cityList = QcityList;
const csbh = props.csbh;
const getRoom = async () => {
  let res = await getRoomList({ PlaceID: csbh, page: 1, pageSize: 999 });
  console.log(res);
  roomList.value = res.data.list;
};
getRoom();

// 禁用
let disable = false;
//表单
const Form = ref();
let form = reactive(JSON.parse(JSON.stringify(Qform)));
//校验
const checkTime = (rule, value, callback) => {
  let start;
  let end;
  if (value != "") {
    end = value.replace(/\-/g, "");
    console.log(end, ",end");
  }
  if (form.glkssj) {
    start = form.glkssj.replace(/\-/g, "");
    console.log(start, "start");
  }
  if (!start) {
    callback(new Error("请输入隔离开始时间"));
  }
  if (end - start <= 0) {
    callback(new Error("隔离结束时间必须大于隔离开始时间"));
  }
};
const rules = reactive({
  glryxm: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  csbh:[{ required: true, message: "必填项不能为空", trigger: "blur" }],
  rylb: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  sfffrjry: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  gj: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  zjlx: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  zjhm: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  sjhm: [
    { required: true, message: "必填项不能为空", trigger: "blur" },
    {
      pattern: /^1(3|4|5|7|8|9)\d{9}$/,
      message: "手机号格式错误",
      trigger: "blur",
    },
  ],
  gldfjbh: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  //   gljssj: [{ validator: checkTime, trigger: "blur" }],
});

//身份证更改校验
const selectClickHandler = (v) => {
  form.zjhm = "";
  if (v == "身份证") {
    rules.zjhm = [
      {
        required: true,
        message: "请输入身份证号",
        trigger: "blur",
      },
      {
        pattern:
          /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
        message: "身份证号码格式错误",
        trigger: "blur",
      },
    ];
  } else {
    rules.zjhm = [
      {
        required: true,
        message: "请输入证件号码",
        trigger: "blur",
      },
    ];
  }
};

//点击取消
const closeDialog = () => {
  Form.value.resetFields();
  dialogFormVisibleShow();
};
//表单提交
const enterDialog = () => {
  let result = JSON.parse(JSON.stringify(form));
  
  result.csbh = csbh || form.csbh;
 
  Form.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    
    if (!result.gljssj || result.gljssj == "0001-01-01T00:00:00Z") {
      delete result.gljssj;
    }
    if (!result.glkssj || result.glkssj == "0001-01-01T00:00:00Z") {
      delete result.glkssj;
    }
    if (!result.zcsj || result.zcsj == "0001-01-01T00:00:00Z") {
      delete result.zcsj;
    }
    if (props.dialogTitle.includes("新增")) {
      try {
        console.log("新增");
        form.gldfjbh = 2;
        form.csbh = "084107030070091651747871";
        let res = await addData({ ...result });
        reGetData();
        console.log(res, "这是新增是否成功的数据");
        if (res.code !== 0) {
          throw new Error(res.msg);
        }
        ElMessage({
          showClose: true,
          message: res.msg,
          type: "success",
          duration: 3000,
        });
      } catch (error) {
        ElMessage({
          showClose: true,
          message: error,
          type: "error",
          duration: 0,
        });
      }
      //新增逻辑处理

     
    } else {
      //修改逻辑处理
      try {
        console.log("修改");
        form.gldfjbh = 2;
        let res = await updateData({ ...result });
        reGetData();
        console.log(res, "这是修改是否成功的数据");
        if (res.code !== 0) {
          throw new Error(res.msg);
        }
        ElMessage({
          showClose: true,
          message: res.msg,
          type: "success",
          duration: 3000,
        });
      } catch (error) {
        ElMessage({
          showClose: true,
          message: error,
          type: "error",
          duration: 0,
        });
      }
    }
    for (let key in form) {
      form[key] = "";
    }
    dialogFormVisibleShow();
  });
};
//回显数据
const echoData = (data, v) => {

  disable = true;
  for (let key in form) {
    for (let key1 in data) if (key1 === key) form[key1] = data[key1];
  }
  if (data.gljssj.Time) form.gljssj = data.gljssj.Time == "0001-01-01T00:00:00Z" ? "" : data.gljssj.Time;
  
  if (data.yjjcglrq.Time) form.yjjcglrq = data.yjjcglrq.Time == "0001-01-01T00:00:00Z" ? "" : data.yjjcglrq.Time;
  
  if (data.zcsj.Time) form.zcsj = data.zcsj.Time == "0001-01-01T00:00:00Z" ? "" : data.zcsj.Time;
  
  form.old_gldfjbh = JSON.parse(JSON.stringify(form.gldfjbh)); //保存旧编号
};
//新增数据初始化表单
const initForm = function (v) {
  disable = false;
  
  for (let key in form) {
    form[key] = "";
  }
  if(csbh!==''){
    form.csbh = csbh
  }
  onMounted(() => {
    console.log("挂载---refresh");
    Form.value.resetFields();
  });
};
defineExpose({
  echoData,
  initForm,
});
</script>
<style>
</style>
