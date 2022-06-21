import service from '@/utils/request'

//  查询
export const getCategory = () => {
  return service({
    url: '/cdpersonnelcategory/selectPersonCategory',
    method: 'get',
  })
}

// 增加
export const createExaCustomer = (data) => {
  return service({
    url: 'cdPersonnelCategory/createdPersonnelCategory',
    method: 'post',
    data
  })
}
// 修改



// 删除
export const deletePlaceRoom = (data) => {
  return service({
    url: '/cdPersonnelCategory/deletePersonnelCategory',
    method: 'post',
    data
  })
}


