import service from '@/utils/request'

// @Summary 分页获取区域数据列表
export const getAreaList = (data) => {
    return service({
        url:'/cdStatisticsRouter/areaManage',
        method:'post',
        data:data
    })
}

// 异常信息详情统计
export const getExceptionInfo = (data) => {
    return service({
        url:'/cdStatisticsRouter/exceptionInfo',
        method:'post',
        data:data
    })
}
