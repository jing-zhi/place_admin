<template>
    <div>
        <div class="selectPart">
            <el-form :inline="true" :model="formSearch" class="demo-form-inline">
                <el-form-item label="行业类型">
                    <el-select v-model="formSearch.industry" placeholder="所有行业">
                        <el-option v-for="item in options" :key="item.ID" :label="item.Name" :value="item.ID" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleExcelExport" icon="download">一键导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 列表数据 -->
        <div class="list">
            <el-table :data="tableData" style="width: 100%; margin-top: 20px">
                <el-table-column prop="hy_name" label="所属行业" width="110" />
                <el-table-column prop="rylb_name" label="人员类别" width="160" />
                <el-table-column prop="not_time_hesuan" label="未按时核酸人员" class-name="hello" />
                <el-table-column prop="green_health_code" label="核酸阴性人数" align="center" />
            </el-table>
        </div>

        <!-- 分页器 -->
        <div class="demo-pagination-block">
            <el-pagination v-model:currentPage="page.currentPage" v-model:page-size="page.pageSize"
                :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="page.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>
<script setup>
import { onBeforeMount, reactive } from "vue-demi";
import { getBusinessMang } from "@/api/place.js";
import { ref, watch } from "vue";
import { debounce } from "@/utils/debounce.js";
import { getAcid, exportExcel } from '@/api/acidStatistics'
const options = ref([]);
const formSearch = reactive({
    industry: "",
});
// 表格数据
const tableData = ref([])

// 获取行业类型数据
const getBusinessList = async () => {
    const { data } = await getBusinessMang({ page: 1, pageSize: 200 });
    options.value = data.list;
    options.value.unshift({ ID: 0, Name: '所有行业' })
};
onBeforeMount(() => {
    getBusinessList();
    getList();
});

// 分页器相关属性
const page = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})
const handleSizeChange = (val) => {
    page.pageSize = val;
};
const handleCurrentChange = (val) => {
    page.currentPage = val;
};
// 获取搜索结果
async function getList() {
    const res = await getAcid({
        "hy_id": Number(formSearch.industry),
        "page": page.currentPage,
        "pageSize": page.pageSize
    })
    page.total = res.data.total;
    tableData.value = res.data.list;
}
// 监听行业选择变化
watch(
    [() => formSearch.industry,
    ()=>page.currentPage,
    ()=>page.pageSize],
    (newVal, oldVal) => {
        getList()
    }
);
// 一键导出方法
const handleExcelExport = debounce(() => {
    exportExcel({
    "hy_id": Number(formSearch.industry),
    "filename":"每日核酸检测.xlsx"
});
});
</script>
<style scoped>
.selectPart {
    padding: 24px;
    padding-bottom: 2px;
    background-color: #fff;
    border-radius: 2px;
    margin-bottom: 12px;
}

.el-pagination {
    justify-content: flex-end;
}
</style>