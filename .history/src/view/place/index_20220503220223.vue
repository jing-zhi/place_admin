<template>
  <div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button class="excel-btn" size="small" type="primary" icon="plus" @click="addPlace">新增</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <!-- <el-table-column align="left" label="记录ID" min-width="70" prop="cd_id" /> -->
        <el-table-column align="left" label="场所编号" min-width="90" prop="csbh" />
        <el-table-column align="left" label="场所名称" min-width="100" prop="csmc" />
        <el-table-column align="left" label="所属区县" min-width="80" prop="qx_name" />
        <el-table-column align="left" label="所属乡镇" min-width="80" prop="sq_name" />
        <el-table-column align="left" label="所属村" min-width="80" prop="jd_name" />
        <el-table-column align="left" label="详细地址" min-width="200" prop="xxdz"/>
        <el-table-column align="left" label="启用状态" min-width="80">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
              @click="switchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" label="经度" min-width="80" prop="gldjd" />
        <el-table-column align="left" label="纬度" min-width="80" prop="gldwd" />
        <el-table-column align="left" label="负责人姓名" min-width="100" prop="fzrxm" />
        <el-table-column align="left" label="负责人电话" min-width="100" prop="fzrdh" />
        <el-table-column align="left" label="负责人身份证" min-width="150" prop="fzrsfz" />
        <el-table-column align="left" label="申领单位" min-width="180" prop="fzrgzdw" />
        <el-table-column align="left" label="申领时间" min-width="180" prop="slsj" />
        <el-table-column align="left" label="行业类型" min-width="120" prop="hylx" />
        <el-table-column label="操作" min-width="150" fixed="right">
          <template #default="scope">
            <el-popover v-model:visible="scope.row.visible" placement="top" width="160">
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
          </template>
        </el-table-column>

      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[5, 10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>

      <el-dialog
        v-model="addDialog"
        custom-class="user-dialog"
        title="场地管理"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
      <div style="height:60vh;overflow:auto;padding:0 10px;">
        <el-form ref="placeForm"  :rules="rules" :model="placeInfo" label-width="110px">
          <el-form-item label="行业类型" prop="hylx">
            <el-select v-model="placeInfo.hylx" class="m-2" placeholder="Select" size="large">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.code"
              />
            </el-select>
            <!-- <el-input v-model="placeInfo.hylx" /> -->
          </el-form-item>
          <el-form-item label="场所名称" prop="csmc">
            <el-input v-model="placeInfo.csmc" />
          </el-form-item>
          <!-- 下拉框 -->
          <el-form-item label="所属区县" prop="qx_name">
            <el-input v-model="placeInfo.qx" />
          </el-form-item>
          <el-form-item label="所属乡镇" prop="sq_name">
            <el-input v-model="placeInfo.sq" />
          </el-form-item>
          <el-form-item label="所属村" prop="jd_name">
            <el-input v-model="placeInfo.jd" />
          </el-form-item>
          <el-form-item label="地址" prop="dz">
            <el-cascader
    v-model="value"
    :options="adds"
    @change="handleChange"></el-cascader>
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

    </div>
  </div>
</template>

<script>
export default {
  name: 'Place',
}
</script>

<script setup>

import { nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getPlaceList,setStatus,createPlace,setInfo,deletePlace } from '@/api/place.js'

const page = ref(1)
const total = ref(0)
const pageSize = ref(5)
const tableData = ref([])
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}


const handleCurrentChange = (val) => {
  page.value = val
  console.log(val);
  getTableData()
}

// 查询
const getTableData = async() => {
  //console.log({ page: page.value, pageSize: pageSize.value });
  const table = await getPlaceList({ page: page.value, pageSize: pageSize.value })
  if (table.code === 0) {
    console.log(table)
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
    console.log({ page: page.value, pageSize: pageSize.value },12);
  }
}

const options = [
        { label: "隔离点", code: 43 },
        { label: "体育场馆", code: 8 },
        { label: "奶茶店", code: 9 },
        { label: "居家", code: 10 },
        { label: "写字楼，办公场所", code: 11 },
        { label: "宾馆", code: 12 },
        { label: "商场和超市", code: 13 },
        { label: "银行", code: 14 },
        { label: "餐厅", code: 15 },
        { label: "理发店", code: 16 },
        { label: "农集贸市场", code: 17 },
        { label: "公园", code: 18 },
        { label: "旅游景点", code: 19 },
        { label: "健身场所", code: 20 },
        { label: "咖啡吧、酒吧、茶座", code: 21 },
        { label: "影剧院", code: 22 },
        { label: "游泳场所", code: 23 },
        { label: "会展中心", code: 24 },
        { label: "游艺游乐场所和上网服务场所", code: 25 },
        { label: "展览馆、博物馆、美术馆", code: 26 },
        { label: "图书馆", code: 27 },
        { label: "歌舞娱乐场所", code: 28 },
        { label: "公共浴室", code: 29 },
        { label: "医疗机构", code: 30 },
        { label: "道路客运", code: 32 },
        { label: "城市公共汽电车", code: 35 },
        { label: "出租汽车", code: 37 },
        { label: "相关行政部门", code: 39 },
        { label: "药店", code: 40 },
        { label: "高速服务区等机构工作人员、生产车间", code: 41 },
        { label: "医废运输处理公司", code: 42 },        
]

const adds =  [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, 
        {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }]

const initPage = async() => {
  getTableData()
}

initPage()

const switchChange = async(row) => {
    console.log({ id: row.id,status:row.status })
    const resStatus = await setStatus({ id: row.id,status:row.status })
      if (resStatus.code === 0) {
        ElMessage.success('修改成功')
      }
}
// 弹窗
const addDialog = ref(false)
const closeAddDialog = () => {
  placeForm.value.resetFields()
  // 置空
  addDialog.value = false
}
const dialogFlag = ref('add')

// 新增
const addPlace = () => {
  dialogFlag.value = 'add'
  addDialog.value = true
}
// 删除
const deletePlaceFun = async(row) => {
  console.log(row.cd_id)
  const res = await deletePlace({ id: row.cd_id })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      row.visible = false
      await getTableData()
    }
}

// 弹窗
const placeInfo = ref({
  "csmc":"",
    "qx":"410702",
    "qx_name":"红旗区",
    "sq":"410702001",
    "sq_name":"西街街道",
    "jd":"410702001016",
    "jd_name":"曙光社区居民委员会",
    "xxdz":"",
    "qyzt":0,
    "gldjd":"242",
    "gldwd":"242",
    "fzrxm":"",
    "fzrdh":"",
    "fzrsfz":"",
    "fzrgzdw":"",
    "slsj":"1998-03-24 20:58:41",
    "hylx":""
})
const rules = ref({
  csmc: [
    { required: true, message: '请输入名', trigger: 'blur' },
    { min: 5, message: '最低5位字符', trigger: 'blur' },
  ],
  xxdz: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    //{ min: 6, message: '最低6位字符', trigger: 'blur' },
  ],
  fzrxm: [
    { required: true, message: '请输入负责人姓名', trigger: 'blur' },
    { min: 1, max:5, message: '最低6位字符', trigger: 'blur' },
  ],
  fzrdh: [
    { required: true, message: '请输入负责人电话', trigger: 'blur' },
    { min: 20, message: '最低6位字符', trigger: 'blur' },
  ],
  fzrsfz: [
    { required: true, message: '请输入负责人身份证', trigger: 'blur' },
    //{ min: 6, message: '最低6位字符', trigger: 'blur' }, 18
  ],
  fzrgzdw: [
    { required: true, message: '请输入申领单位', trigger: 'blur' },
    { min: 2, message: '最低2位字符', trigger: 'blur' }, 
  ],

})

const placeForm = ref(null)

// 修改
const editPlace = () => {
  dialogFlag.value = 'edit'
  addDialog.value = true
}

// 确认增加修改
const enterAddDialog = async() => {
  // placeForm.value.validate(async valid => {
  //   if (valid) {
  //     const req = {
  //       ...placeInfo.value,
  //     }
  //     if (dialogFlag.value === 'add') {
  //       const res = await register(req)
  //       if (res.code === 0) {
  //         ElMessage({ type: 'success', message: '创建成功' })
  //         await getTableData()
  //         closeAddUserDialog()
  //       }
  //     }
  //     if (dialogFlag.value === 'edit') {
  //       const res = await setplaceInfo(req)
  //       if (res.code === 0) {
  //         ElMessage({ type: 'success', message: '编辑成功' })
  //         await getTableData()
  //         closeAddUserDialog()
  //       }
  //     }
  //   }
  // })
      const req = {
        ...placeInfo.value,
      }
      console.log(req)
      // 新增
      if (dialogFlag.value === 'add') {
        console.log("add")
        // const res = await createPlace(req)
        // if (res.code === 0) {
        //   ElMessage({ type: 'success', message: '创建成功' })
        //   await getTableData()
        //   closeAddUserDialog()
        // }
      }
      // 修改
      if (dialogFlag.value === 'edit') {
        console.log("edit")
        // const res = await setInfo(req)
        // if (res.code === 0) {
        //   ElMessage({ type: 'success', message: '编辑成功' })
        //   await getTableData()
        //   closeAddUserDialog()
        // }
      }
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
