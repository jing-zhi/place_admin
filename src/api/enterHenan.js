import service from '../utils/request'
import * as XLSX from 'xlsx'

// 获取行业类别


// 获取分页数据
export const getUserList = (data) => {
    return service({
        url:'',
        method:'post',
        data:data
    })
}

// 获取搜索列表数据


/*
    * @description:
    * @param {Object} json 服务端发过来的数据
    * @param {String} name 导出Excel文件名字
   
    * @param {String} titleArr 导出Excel表头
   
    * @param {String} sheetName 导出sheetName名字
    * @return:
    */
export const exportExcel = (json, name, titleArr, sheetName) => {
    /* convert state to workbook */
    var data = new Array();
    var keyArray = new Array();
    const getLength = function (obj) {
      var count = 0;
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
        count++;
        }
      }
    return count;
    };
    for (const key1 in json) {
    if (json.hasOwnProperty(key1)) {
      const element = json[key1];
      var rowDataArray = new Array();
      for (const key2 in element) {
      if (element.hasOwnProperty(key2)) {
        const element2 = element[key2];
        rowDataArray.push(element2);
        if (keyArray.length < getLength(element)) {
        keyArray.push(key2);
        }
      }
      }
      data.push(rowDataArray);
    }
    }
    // keyArray为英文字段表头
    data.splice(0, 0, keyArray, titleArr);
    console.log('data', data);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    // 此处隐藏英文字段表头
    var wsrows = [{ hidden: true }];
    ws['!rows'] = wsrows; // ws - worksheet
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    /* generate file and send to client */
    XLSX.writeFile(wb, name + '.xlsx');
  }
