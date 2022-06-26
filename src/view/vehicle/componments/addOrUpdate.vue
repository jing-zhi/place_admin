<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="dialogTitle"
    :show-close="true"
    :before-close="closeDialog"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
  <!-- :rules="rules" -->
     <el-form ref="Form" :model="formData"   size="medium" label-width="100px" labelPosition="top" >
      <el-form-item label="姓名" prop="people_name">
        <el-input v-model="formData.people_name" placeholder="请输入您的姓名" clearable :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone_number">
        <el-input v-model="formData.phone_number" placeholder="请输入您的手机号码" :maxlength="11" clearable
          :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="id_card">
        <el-input v-model="formData.id_card" placeholder="请输入您的身份证号码" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="车牌号码" prop="plate_number">
        <el-input v-model="formData.plate_number" placeholder="请输入您的车牌号码" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="进入场所">
        <el-input v-model=this.place_name :disabled='true' clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="日期选择" prop="expected_enter_day">
        <el-date-picker v-model="formData.expected_enter_day" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          :style="{width: '100%'}" placeholder="请选择日期选择" clearable></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="closeDialog">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="enterDialog"
        >确 定</el-button>
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
} from '@/api/vehicleRecord'
import { defineProps, ref, reactive, inject, nextTick, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { vehicleList } from '@/data/vehicle'
import { vehicleList } from '../../../data/vehicle';

// 父组件方法
const dialogFormVisibleShow = inject('dialogFormVisibleShow')
const reGetData = inject('reGetData')
// 参数
const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false,
  },
  dialogTitle: {
    type: String,
    default: '',
  },
  // csbh: {
  //   type: String,
  //   default: '',
  // },
})
// const formData =reactive({
//         people_name: undefined,
//         phone_number: undefined,
//         id_card: undefined,
//         plate_number: undefined,
//         place_number: undefined,
//         expected_enter_day: null,
//       },)
// 禁用
let disable = false
// 表单
const Form = ref()
const formData = reactive(JSON.parse(JSON.stringify(vehicleList)))
// 校验
const rules = reactive({
  people_name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  plate_number: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  place_number: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  expected_enter_day: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  phone_number: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    {
      pattern: /^1(3|4|5|7|8|9)\d{9}$/,
      message: '手机号格式错误',
      trigger: 'blur',
    },
  ],
  id_card: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    {
        pattern:
          /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
        message: '身份证号码格式错误',
        trigger: 'blur',
    },
  ],
})

// 点击取消
const closeDialog = () => {
  Form.value.resetFields()
  dialogFormVisibleShow()
}
// 表单提交
const enterDialog = () => {
  const result = JSON.parse(JSON.stringify(formData))

  Form.value.validate(async(valid) => {
     if (valid){
               try {
        console.log('新增')
        console.log(result);
        const res = await addData({ ...result })
        reGetData()
        console.log(res, '这是新增是否成功的数据')
        if (res.code !== 0) {
          throw new Error(res.msg)
        }
        ElMessage({
          showClose: true,
          message: res.msg,
          type: 'success',
          duration: 3000,
        })
      } catch (error) {
        ElMessage({
          showClose: true,
          message: error,
          type: 'error',
          duration: 0,
        })
      }       
      } 
      for (const key in form) {
      form[key] = ''
    }
    dialogFormVisibleShow()   
  })
}
const echoData = (data, v) => {
  disable = true
  for (const key in formData) {
    for (const key1 in data) if (key1 === key) formData[key1] = data[key1]
  }
}
// 新增数据初始化表单
const initForm = function(v) {
  disable = false

  for (const key in formData) {
    formData[key] = ''
  }
  // if (csbh !== '') {
  //   formData.csbh = csbh
  // }
  onMounted(() => {
    console.log('挂载---refresh')
    Form.value.resetFields()
  })
}
defineExpose({
  echoData,
  initForm,
})
</script>
<style>
</style>
