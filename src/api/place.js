import service from '@/utils/request'

// @Summary 场合新增
// @Produce  application/json
// @Param data body {}
// @Router /place [post]
export const createPlace = (data) => {
  return service({
    url: '/cd/cdRegister',
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
    url: '/cd/deleteCd',
    method: 'post',
    data: data
  })
}

// @Summary 场合修改
// @Produce  application/json
// @Param data body {}
// @Router /place [post]
export const setPlace = (data) => {
  return service({
    url: '/cd/updateCd',
    method: 'post',
    data: data
  })
}
export const getBusinessMang = (data) => {
  return service({
    url: "cdIndustry/pageIndustryList",
    method: 'POST',
    data
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

// 场所导出Excel
export const exportExcel = data => {
  return service({
    url: '/cd/exportExcel',
    method: 'post',
    data,
    responseType:'blob'
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