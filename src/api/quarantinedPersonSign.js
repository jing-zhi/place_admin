import service from '@/utils/request'
//分页查询
export const getData = (data) => {
    return service({
        url: '/cdglry/record/lists',
        method: 'POST',
        data
    })
}