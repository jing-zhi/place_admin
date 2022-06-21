import service from '@/utils/request'

//  查询
export const getCategory = () => {
  return service({
    url: '/cdpersonnelcategory/selectPersonCategory',
    method: 'get',
  })
}

// 增加

// 修改

// 删除
export const deletePlaceRoom = (data) => {
  return service({
    url: '/placeRoom/deletePlaceRoom',
    method: 'delete',
    data
  })
}


