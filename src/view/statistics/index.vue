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
          <div id="health-code"  :style="{ width: '480px', height: '300px' }">
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card_item">
          <template #header>
            <div>核酸状况统计</div>
          </template>
          <div id="hesuan-info" :style="{ width: '480px', height: '300px' }">
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getWorkerState } from '@/api/csUser/statistics.js'
import { onMounted ,onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'

const timer = ref(null)
const state = ref({})

const reload = async() => {
  const { data } = await getWorkerState()
  state.value = data
// 健康码状况统计
  var myChart = echarts.init(document.getElementById('health-code'));
  myChart.setOption({
    legend: {
        orient: 'vertical',
        left: 'left',
    },
 series: [
    {
      type: 'pie',
      label: {
        show: true
      },
      color:[
        '#dd6b66',
        '#759aa0',
      ],
      center:['50%','35%'],
      
      data: [
        {
          value: state.value.HealthyCode[1].total,
          name: state.value.HealthyCode[1].healthCode
        },
        {
          value: state.value.HealthyCode[0].total,
          name: state.value.HealthyCode[0].healthCode
        },
      ],
      radius:'45%',
      hoverAnimation:false,
    }
  ]
})

var hesuan  = echarts.init(document.getElementById('hesuan-info'));
hesuan.setOption({
 color:[
  '#cc7e63',
  '#61a0a8'
 ],
 legend: {
        orient: 'vertical',
        left: 'left',
    },
 series: [
    {
      type: 'pie',
      // label: {
      //   show: false
      // },
      center:['50%','35%'],
      data: [
        {
          value: state.value.HeSuanRecord[0].total,
          name: state.value.HeSuanRecord[0].heSuanInfo
        },
        {
          value:state.value.HeSuanRecord[1].total,
          name: state.value.HeSuanRecord[1].heSuanInfo
        },
      ],
      radius:'45%',
      hoverAnimation:false,

    }
  ]
})

}

reload()
timer.value = setInterval(() => {
  reload()
}, 800)

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
