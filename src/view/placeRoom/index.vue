<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="场所编号">
          <el-input v-model="searchInfo.PlaceID" placeholder="场所编号" />
        </el-form-item>
        <el-form-item label="原房间号">
          <el-input v-model="searchInfo.RoomNumber" placeholder="原房间号" />
        </el-form-item>
        <el-form-item label="房间新编号">
          <el-input v-model="searchInfo.GLRoomNumber" placeholder="房间新编号" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="openDialog('addPlaceRoom')">新增</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column align="left" label="隔离点编号" min-width="220" prop="PlaceID" />
        <el-table-column align="left" label="隔离点名称" min-width="130" prop="Place.csmc" />
        <el-table-column align="left" label="原房间号" min-width="130" prop="RoomNumber" />
        <el-table-column align="left" label="房间新编号" min-width="130" prop="GLRoomNumber" />
        <el-table-column align="left" label="隔离点楼号" min-width="150" prop="BuildingNumber" />
        <el-table-column align="left" label="隔离点楼层号" min-width="150" prop="FloorNumber" />
        <el-table-column align="left" label="隔离点房间使用状态" min-width="150" prop="State">
          <template #default="scope">
            <el-switch
                v-model="scope.row.State"
                :disabled="true"
                :active-value="'1'"
                :inactive-value="'0'"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" label="房间创建时间" width="180">
          <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
        </el-table-column>
        <el-table-column align="left" label="房间更新时间" width="180">
          <template #default="scope">{{ formatDate(scope.row.UpdatedAt) }}</template>
        </el-table-column>
        <el-table-column align="left" fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button
                icon="edit"
                size="small"
                type="text"
                @click="editPlaceRoomFunc(scope.row)"
            >编辑
            </el-button>
            <el-button
                icon="delete"
                size="small"
                type="text"
                @click="deletePlaceRoomFunc(scope.row)"
            >删除
            </el-button>
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

    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
      <warning-bar title="通过场所管理的房间管理跳转，可自动填充隔离点编号" />
      <el-form ref="apiForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="隔离点编号" prop="PlaceID">
          <el-input v-model="form.PlaceID" autocomplete="off" />
        </el-form-item>
        <el-form-item label="楼号" prop="BuildingNumber">
          <el-input v-model="form.BuildingNumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="楼层号" prop="FloorNumber">
          <el-input v-model="form.FloorNumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="房间号" prop="RoomNumber">
          <el-input v-model="form.RoomNumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="隔离点房间号" prop="GLRoomNumber">
          <el-input v-model="form.GLRoomNumber" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PlaceRoom',
}
</script>

<script setup>
import warningBar from '@/components/warningBar/warningBar.vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPlaceRoomList, createPlaceRoom, updatePlaceRoom, deletePlaceRoom } from '@/api/place_room'
import { formatDate } from '@/utils/format'

const form = ref({
  PlaceID: '',
  RoomNumber: '',
  GLRoomNumber: '',
  BuildingNumber: '',
  FloorNumber: '',
  State: '',
})

const type = ref('')
const rules = ref({
  PlaceID: [
    { required: true, message: '隔离点编号', trigger: 'blur' },
  ],
  BuildingNumber: [
    { required: true, message: '请输入楼号', trigger: 'blur' },
  ],
  FloorNumber: [
    { required: true, message: '请输入楼层', trigger: 'blur' },
  ],
  RoomNumber: [
    { required: true, message: '请输入原房间号', trigger: 'blur' },
  ],
  GLRoomNumber: [
    { required: true, message: '请输入房间新编号', trigger: 'blur' },
  ]
})
import { useRoute } from 'vue-router'
const router = useRoute()
const placeID = ref('')
placeID.value = router.params.PlaceID ? router.params.PlaceID : ''
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({ PlaceID: placeID.value })

const onReset = () => {
  searchInfo.value = {}
}
// 搜索

const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData()
}

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
const getTableData = async() => {
  const table = await getPlaceRoomList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

getTableData()

// 弹窗相关
const apiForm = ref(null)
const initForm = () => {
  apiForm.value.resetFields()
  form.value = {
    PlaceID: '',
    RoomNumber: '',
    GLRoomNumber: '',
    BuildingNumber: '',
    FloorNumber: '',
    State: '',
  }
}

const dialogTitle = ref('新增隔离点房间')
const dialogFormVisible = ref(false)
const openDialog = (key) => {
  switch (key) {
    case 'addPlaceRoom':
      dialogTitle.value = '新增隔离点房间'
      form.value.PlaceID = placeID.value
      break
    case 'edit':
      dialogTitle.value = '编辑隔离点房间'
      break
    default:
      break
  }
  type.value = key
  dialogFormVisible.value = true
}
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const editPlaceRoomFunc = async(row) => {
  form.value = JSON.parse(JSON.stringify(row))
  openDialog('edit')
}

const enterDialog = async() => {
  apiForm.value.validate(async valid => {
    if (valid) {
      switch (type.value) {
        case 'addPlaceRoom': {
          const res = await createPlaceRoom(form.value)
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '添加成功',
              showClose: true,
            })
          }
          getTableData()
          closeDialog()
        }

          break
        case 'edit': {
          const res = await updatePlaceRoom(form.value)
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '编辑成功',
              showClose: true,
            })
          }
          getTableData()
          closeDialog()
        }
          break
        default:
          // eslint-disable-next-line no-lone-blocks
        {
          ElMessage({
            type: 'error',
            message: '未知操作',
            showClose: true,
          })
        }
          break
      }
    }
  })
}

const deletePlaceRoomFunc = async(row) => {
  ElMessageBox.confirm('此操作将永久删除该房间, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(async() => {
        const res = await deletePlaceRoom(row)
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '删除成功!',
          })
          if (tableData.value.length === 1 && page.value > 1) {
            page.value--
          }
          getTableData()
        }
      })
}

</script>

<style scoped lang="scss">
.button-box {
  padding: 10px 20px;

  .el-button {
    float: right;
  }
}

.warning {
  color: #dc143c;
}
</style>
