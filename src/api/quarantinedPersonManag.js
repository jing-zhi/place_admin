import service from '@/utils/request'
//单个删除的接口
export const singleDelete = data => {
    return service({
        url: '/cdglry/del',
        method:'POST',
        data
    })
}
export const addData = data => {
    return service({
        url: '/cdglry/add',
        method: 'POST',
        data
    })
}
export const updateData = data => {
    return service({
        url: '/cdglry/update',
        method: 'POST',
        data
    })
}
export const getData = data => {
    return service({
        url: '/cdglry/lists',
        method: 'POST',
        data
    })
}