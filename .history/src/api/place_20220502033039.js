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

// @Tags User
// @Summary 分页获取用户列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body modelInterface.PageInfo true "分页获取用户列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /user/getUserList [post]
export const getPlaceList = (data) => {
  return service({
    url: '/cd/lists',
    method: 'post',
    data: data
  })
}

// @Tags User
// @Summary 删除
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.SetUserAuth true "删除"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"修改成功"}"
// @Router /user/deleteUser [delete]
export const deletePlace = (data) => {
  return service({
    url: '/',
    method: 'delete',
    data: data
  })
}

// @Tags User
// @Summary 设置信息
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysUser true "设置信息"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"修改成功"}"
// @Router /user/setUserInfo [put]
export const setInfo = (data) => {
  return service({
    url: '/',
    method: 'put',
    data: data
  })
}
