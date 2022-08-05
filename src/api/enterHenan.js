import service from '../utils/request'
import {ElMessage} from 'element-plus'

// 获取分页数据
export const getTableList = (data) => {
    return service({
        url:'/cdStatisticsRouter/is14Rhn',
        method:'post',
        data:data
    })
}

// 获取工作人员管理表单数据
export const getWorkerList = (data) => {
  return service({
    url: '/cdworker/pageWorkerList',
    method: 'post',
    data: data
  })
}


// 导出文件
export const exportExcel = data => {
  // console.log(data);
  return service({
    url: '/cdStatisticsRouter/is14RhnExcelExport',
    method: 'post',
    data,
    responseType: 'blob'
  }).then(res => {
    handleFileError(res,data.file_name)
})
}

const handleFileError = (res, fileName) => {
  if (res.data === 'undefined') {
    // console.log(res.data);
    if (res.data.type !== 'application/json') {
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
