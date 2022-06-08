<template>
  <div>
    <el-row class="state">
      <el-col>
      <el-card>
        <div class="title">
            管理区域状况统计
        </div>
        <div class="info">
            详情见工作人员管理界面
        </div>
      </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="15" class="state">
      <el-col :span="12">
        <el-card
          class="card_item"
        >
          <template #header>
            <div>健康码状况统计</div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">
                <!-- <el-row :gutter="10">
                <el-col :span="12">红码:</el-col>
                <el-col :span="12" v-text="state.healthCode.red" />
                </el-row>
                <el-row :gutter="10">
                <el-col :span="12">黄码:</el-col>
                <el-col :span="12" v-text="state.healthCode.yellow" />
                </el-row>
                <el-row :gutter="10">
                <el-col :span="12">绿码:</el-col>
                <el-col :span="12" v-text="state.healthCode.green" />
                </el-row> -->
                <el-row :gutter="10" v-for="(item, index) in state.HealthyCode" :key="index">
                <el-col :span="12">{{item.healthCode}}：</el-col>
                <el-col :span="12" v-text="item.total" />
                </el-row>
              </el-col>
            </el-row>
            <!-- 百分比条形进度条 -->
            <!-- <el-row :gutter="10">
              <el-col :span="12">红码:</el-col>
              <el-col :span="12">
                <el-progress
                type="line"
                :percentage="+state.healthCode.red.toFixed(0)"
                :color="colors"
                />
              </el-col>
            </el-row> -->
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card_item">
          <template #header>
            <div>核酸状况统计</div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">
                <!-- <el-row :gutter="10">
                  <el-col :span="12">阴性：</el-col>
                  <el-col :span="12" v-text="state.hesuanInfo.yin" />
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">阳性：</el-col>
                  <el-col :span="12" v-text="state.hesuanInfo.yang" />
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">无48小时核酸：</el-col>
                  <el-col :span="12" v-text="state.hesuanInfo.wu" />
                </el-row> -->
                <el-row :gutter="10" v-for="(item, index) in state.HeSuanRecord" :key="index">
                  <el-col :span="12">{{item.heSuanInfo}}：</el-col>
                  <el-col :span="12" v-text="item.total" />
                </el-row>
              </el-col>
              
              <!-- 百分比环形进度条 -->
              <!-- <el-col :span="12">
                <el-progress
                  type="dashboard"
                  :percentage="state.hesuanInfo.yang"
                  :color="colors"
                />
              </el-col> -->
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getWorkerState } from '@/api/csUser/statistics.js'
import { onUnmounted, ref } from 'vue'
const timer = ref(null)
const state = ref({})

const reload = async() => {
  const { data } = await getWorkerState()
  state.value = data
//   let data = {
//         "HealthyCode": [
//             {
//                 "healthCode": "绿码",
//                 "total": 980
//             },
//             {
//                 "healthCode": "红码",
//                 "total": 0
//             },
//             {
//                 "healthCode": "黄码",
//                 "total": 8
//             }
//         ],
//         "HeSuanRecord": [
//             {
//                 "heSuanInfo": "阴性",
//                 "total": 392
//             },
//             {
//                 "heSuanInfo": "无48小时核酸",
//                 "total": 596
//             },
//             {
//                 "heSuanInfo": "阳性",
//                 "total": 0
//             }
//         ]
//   }
//   state.value = data
}

reload()
timer.value = setInterval(() => {
  reload()
}, 1000 * 10)

onUnmounted(() => {
  clearInterval(timer.value)
  timer.value = null
})

</script>

<script>
export default {
  name: 'Statistics',
}
</script>

<style>
.state {
  padding: 10px;
}

.card_item {
  height: 280px;
}

.title {
    font-size: 22px;
    color: #343844;
}
.info {
    font-size: 14px;
    color: #6B7687;
    margin-top: 24px;
}
</style>
