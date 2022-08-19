import service from '@/utils/request'

// @Summary 新增
// @Produce  application/json
// @Param data body {}
// @Router /place [post]
export const createWorker = (data) => {
  return service({
    url: '/cdworker/createWorkerDetails',
    method: 'post',
    data: data
  })
}

// @Tags User
// @Summary 分页获取列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body modelInterface.PageInfo true "分页获取用户列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /user/getUserList [post]
export const getWorkerList = (data) => {
  return service({
    url: '/cdworker/pageWorkerList',
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
export const deleteWorker = (data) => {
  return service({
    url: '/cdworker/deleteWorker',
    method: 'post',
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
export const setWorker = (data) => {
  return service({
    url: '/cdworker/updateWorkerDetails',
    method: 'post',
    data: data
  })
}

// 工作人员打卡详情分页列表
export const getWorkerDetailsList = (data) => {
  return service({
    url: '/cdworker/pageWorkerRecordList',
    method: 'post',
    data: data
  })
}

// 模糊查询获取场所列表
export const getPlaceList = (data)=>{
  return service({
    url:'/api/cd/lists',
    method:'post',
    data:data
  })

}

// 批量删除
export const deletePlaceById = (data) => {
  return service({
    url:'/cdworker/deleteWorkerByIds',
    method:'post',
    data:data
  })
}

// 查看场所码详情
export const getCodeScanDetail = (data) => {
  return service({
    url:'/cdworker/workerCsmRecordList',
    method:'post',
    data:data
  })
}

// 工作人员导出Excel
export const exportExcel = data => {
  return service({
    url: '/cdworker/exportExcel',
    method: 'post',
    data,
    responseType: 'blob'
  }).then(res => {
    handleFileError(res,data.fileName)
})
}

const handleFileError = (res, fileName) => {
  if (typeof (res.data) !== 'undefined') {
    if (res.data.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = function() {
        const message = JSON.parse(reader.result).msg
        ElMessage({
          showClose: true,
          message: message,
          type: 'error'
        })
      }
      reader.readAsText(new Blob([res.data]))
    }
  } else {
    var downloadUrl = window.URL.createObjectURL(new Blob([res]))
    var a = document.createElement('a')
    a.style.display = 'none'
    a.href = downloadUrl
    a.download = fileName
    var event = new MouseEvent('click')
    a.dispatchEvent(event)
  }
}

export const getscanfDetails = (data) =>{
  return service({
    url:'/cdworker/workerCsmRecordList',
    method:'post',
    data
  })


}