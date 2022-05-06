import service from '@/utils/request'
// @Tags api
// @Summary 分页获取角色列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body modelInterface.PageInfo true "分页获取用户列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /api/getApiList [post]
// {
//  page     int
//	pageSize int
// }
export const getPlaceRoomList = (data) => {
  return service({
    url: '/placeRoom/getPlaceRoomList',
    method: 'post',
    data
  })
}

// @Tags Api
// @Summary 创建基础api
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.CreateApiParams true "创建api"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /placeRoom/createPlaceRoom [post]
export const createPlaceRoom = (data) => {
  return service({
    url: '/placeRoom/createPlaceRoom',
    method: 'post',
    data
  })
}

// @Tags Api
// @Summary 更新api
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.CreateApiParams true "更新api"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /api/updateApi [post]
export const updatePlaceRoom = (data) => {
  return service({
    url: '/placeRoom/updatePlaceRoom',
    method: 'post',
    data
  })
}

// @Tags Api
// @Summary 删除指定api
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body dbModel.Api true "删除api"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /placeRoom/deletePlaceRoom [post]
export const deletePlaceRoom = (data) => {
  return service({
    url: '/placeRoom/deletePlaceRoom',
    method: 'delete',
    data
  })
}
