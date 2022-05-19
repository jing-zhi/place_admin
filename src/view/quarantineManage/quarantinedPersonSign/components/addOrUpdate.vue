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
          <el-form-item label="城市" prop="city">
            <el-cascader placeholder="城市" clearable v-model='form.city'  :options="options" filterable @change="test"/>
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
<script lang='ts' setup>
import { reactive, ref } from "@vue/reactivity";
import { defineProps, defineExpose, inject } from "vue";
// import { Qform } from "../../../data/quarantined";

const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false,
  },
  dialogTitle: {
    type: String,
    default: "",
  },
});
const Qform = {
  city: ''
};
const options = [
    {
      value: 1,
      label: "河南省",
      children: [
        {
          value: 11,
          label: "新乡市",
          children: [
            {
              value: 111,
              label: "洪门镇",
            },
          ],
        },
      ],
    },
    {
      value: 1,
      label: "河南省",
      children: [
        {
          value: 22,
          label: "郑州市",
          children: [
            {
              value: 222,
              label: "金水区",
            },
          ],
        },
      ],
    },
  ];
const dialogFormVisibleShow = inject("dialogFormVisibleShow");
const form = ref(Qform);
const Form = ref(null);
const test =  ()=>{
    console.log(form.value.city)
}




//点击取消
const closeDialog = () => {
  Form.value.resetFields();
  dialogFormVisibleShow();
};

//供父组件调用***************
const initForm = (v) => {
  Form.value.resetFields();
  console.log("父组件调用");
};
const echoData = (data, v) => {
  //回显数据
  console.log("父组件调用回显数据");
 
};
defineExpose({
  echoData,
  initForm,
});
</script>
<style>
</style>
