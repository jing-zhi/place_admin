import service from '@/utils/request'
// @Router /authority/getAuthorityList [post]
export const getDeptList = (data) => {
  return service({
    url: '/department/lists',
    method: 'post',
    data
  })
}

// @Summary 删除
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body {authorityId uint} true "删除部门"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /authority/deleteAuthority [post]
export const deleteDepartment = (data) => {
  return service({
    url: '/department/deleteDept',
    method: 'post',
    data
  })
}

// @Summary 创建部门
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.CreateAuthorityPatams true "创建部门"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /authority/createAuthority [post]
export const createDept = (data) => {
  return service({
    url: 'department/addDept',
    method: 'post',
    data
  })
}

// @Summary 修改部门
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysAuthority true "修改部门"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"设置成功"}"
// @Router /authority/setDataAuthority [post]
export const updateDept = (data) => {
  return service({
    url: '/department/updateDept',
    method: 'post',
    data
  })
}
