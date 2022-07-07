import service from '@/utils/request'

//  查询
export const getCategory = (data) => {
  return service({
    url: 'cdPersonnelCategory/selectPersonCategory',
    method: 'post',
    data
  })
}

// 增加
export const createPelop = (data) => {
  return service({
    url: '/cdPersonnelCategory/createdPersonnelCategory',
    method: 'post',
    data
  })
}
// 修改
export const updataPelop = (data) => {
  return service({
    url: '/cdPersonnelCategory/updatePersonCategory',
    method: 'post',
    data
  })
}



// 删除y
export const deleteCategory= (data) => {
  return service({
    url: '/cdPersonnelCategory/deletePersonnelCategory',
    method: 'post',
    data
  })
}


