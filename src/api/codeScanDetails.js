import service from '@/utils/request'

// @Summary 分页获取场所列表
export const getPlaceContent = (data) => {
    return service({
      url: '/cd/lists',
      method: 'post',
      data 
    })
}

// 获取数据
export const getTabledata = (data) => {
    return service({
        url:'/cdworker/siteCodeRecord',
        method:'post',
        data
    })
}