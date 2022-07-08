import service from '@/utils/request'

// @Summary 分页获取行业列表
export const getIndustryList = (data) => {
  return service({
    url: '/cdIndustry/pageIndustryList',
    method: 'post',
    data: data 
  })
}

// 新增行业
export const addIndustryName = (data) => {
  return service({
    url:'/cdIndustry/createIndustry',
    method:'post',
    data:data
  })
}

// 删除行业
export const deleteIndustry = (data) => {
  return service({
    url:'/cdIndustry/deleteIndustry',
    method:'post',
    data:data
  })
}


// @Summary 行业修改
// @Produce  application/json
// @Param data body {}
export const setIndustry = (data) => {
  return service({
    url: '/cdIndustry/updateIndustryByID',
    method: 'post',
    data: data
  })
}
