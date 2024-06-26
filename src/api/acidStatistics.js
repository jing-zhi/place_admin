import service from '@/utils/request'
// 获取数据
export const getAcid = (data)=>{
    return service({
        url: '/hesuan/pageHesuanList',
        method: 'post',
        data
    })
}
// 导出
export const exportExcel = (data) => {
    return service({
      url: '/hesuan/exportExcel',
      method: 'post',
      data,
      responseType: 'blob'
    }).then(res => {
      handleFileError(res,data.filename)
    })
  }
  
  const handleFileError = (res, fileName="每日核酸检测.xlsx") => {
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
  