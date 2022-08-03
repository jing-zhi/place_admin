<template>
  <div>
    <el-row class="state">
      <el-col>
        <el-card>
          <div class="title">管理区域状况统计</div>
          <div class="info">详情见工作人员管理界面</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="15" class="state">
      <el-col :span="12">
        <el-card class="card_item">
          <template #header>
            <div>健康码状况统计</div>
          </template>
          <div
            id="health-code"
            :style="{ width: '480px', height: '300px' }"
          ></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card_item">
          <template #header>
            <div>核酸状况统计</div>
          </template>
          <div
            id="hesuan-info"
            :style="{ width: '480px', height: '300px' }"
          ></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getWorkerState } from "@/api/csUser/statistics.js";
import { onUnmounted, ref } from "vue";
import * as echarts from "echarts";

const timer = ref(null);
const state = ref({});

const reload = async () => {
  const { data } = await getWorkerState();
  state.value = data;
  // console.log(state.value.HealthyCode[0].healthCode);
  // 健康码状况统计
  var myChart = echarts.init(document.getElementById("health-code"));
  myChart.setOption({
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      x: "left",
      data: [state.value.HealthyCode[0].healthCode],
    },
    series: [
      {
        name: "健康码状况",
        type: "pie",
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: "outside",
            formatter: "{d}%",

            textStyle: {
              align: "center",
              baseline: "middle",
              fontFamily: "微软雅黑",
              fontSize: 12,
            },
          },
        },
        color: ["#759aa0", "#dd6b66"],
        center: ["50%", "35%"],

        data: [
          {
            value: state.value.HealthyCode[0].total,
            name: state.value.HealthyCode[0].healthCode,
          },
          // {
          //   value: state.value.HealthyCode[1].total,
          //   name: state.value.HealthyCode[1].healthCode
          // },
        ],
        radius: "45%",
        hoverAnimation: false,
      },
    ],
  });

  var hesuan = echarts.init(document.getElementById("hesuan-info"));
  hesuan.setOption({
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    color: ["#ea7e53", '#73a373', "#e69d87", "#8dc1a9"],
    legend: {
      orient: "vertical",
      x: "left",
      data: [
        state.value.HeSuanRecord[0].heSuanInfo,
        state.value.HeSuanRecord[1].heSuanInfo,
        state.value.HeSuanRecord[2].heSuanInfo,
        state.value.HeSuanRecord[3].heSuanInfo,
      ],
    },
    series: [
      {
        name: "核酸状况",
        type: "pie",
        avoidLabelOverlap: false,
        // label: {
        //   show: false
        // },
        label: {
          normal: {
            show: true,
            position: "outside",
            formatter: "{d}%",

            textStyle: {
              align: "center",
              baseline: "middle",
              fontFamily: "微软雅黑",
              fontSize: 12,
            },
          },
        },
        center: ["50%", "35%"],
        data: [
          {
            value: state.value.HeSuanRecord[0].total,
            name: state.value.HeSuanRecord[0].heSuanInfo,
          },
          {
            value: state.value.HeSuanRecord[1].total,
            name: state.value.HeSuanRecord[1].heSuanInfo,
          },
          {
            value: state.value.HeSuanRecord[2].total,
            name: state.value.HeSuanRecord[2].heSuanInfo,
          },
          {
            value: state.value.HeSuanRecord[3].total,
            name: state.value.HeSuanRecord[3].heSuanInfo,
          },
        ],
        radius: "45%",
        hoverAnimation: false,
      },
    ],
  });
};

reload();
timer.value = setInterval(() => {
  reload()
}, 800)

onUnmounted(() => {
  clearInterval(timer.value);
  timer.value = null;
});
</script>

<script>
export default {
  name: "Statistics",
};
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
  color: #6b7687;
  margin-top: 24px;
}
</style>
