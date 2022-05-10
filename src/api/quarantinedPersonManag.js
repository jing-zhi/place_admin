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