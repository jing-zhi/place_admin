import service from '@/utils/request'

// @Summary 分页获取区域数据列表
export const getAreaList = (data) => {
    return service({
        url:'/cdStatisticsRouter/pageManageAreaList',
        method:'post',
        data:data
    })
}