import service from '@/utils/request'
//单个删除的接口
export const singleDelete = data => {
    return service({
        url: '/cdglry/del',
        method:'POST',
        data
    })
}
//新增
export const addData = data => {
    return service({
       
        url: '/cdglry/add',
        method: 'POST',
        data
    })
}
//修改
export const updateData = data => {
    return service({
       
        url: '/cdglry/update',
        method: 'POST',
        data
    })
}
//分页
export const getData = data => {
    return service({
        url: '/cdglry/lists',
        method: 'POST',
        data
    })
}
//房间编号
export const getRoomList = data => {
    return service({
        url: '/placeRoom/getPlaceRoomList',
        method: "POST",
        data
    })
}
export const exportApi = data => {
    return service({
        url: '/cdglry/exportExcel',
        method: 'POST',
        data,
        responseType:'blob'
    }).then(res => {
        handleFileError(res,"glry_export.xlsx")
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