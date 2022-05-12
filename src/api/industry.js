import service from '@/utils/request'

// @Summary 分页获取行业列表
export const getIndustryList = (data) => {
  return service({
    url: '/cdIndustry/pageIndustryList',
    method: 'post',
    data: data //
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
