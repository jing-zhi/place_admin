import service from '@/utils/request'

// @Summary 场合新增
// @Produce  application/json
// @Param data body {}
// @Router /place [post]
export const createPlace = (data) => {
  return service({
    url: '/cd/lists',
    method: 'post',
    data: data
  })
}

// @Summary 分页获取场所列表
export const getPlaceList = (data) => {
  return service({
    url: '/cd/lists',
    method: 'post',
    data: data //
  })
}

// @Summary 删除场合
export const deletePlace = (data) => {
  return service({
    url: '/',
    method: 'delete',
    data: data
  })
}

// @Summary 场合修改
// @Produce  application/json
// @Param data body {}
// @Router /place [post]
export const setPlace = (data) => {
  return service({
    url: '/',
    method: 'put',
    data: data
  })
}

// @Summary 启用场合
export const setStatus = (data) => {
  return service({
    url: '/cd/status',
    method: 'post',
    data: data
  })
}