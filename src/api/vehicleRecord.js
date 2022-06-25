import service from '@/utils/request'

//分页
export const getData = data => {
    return service({
        url: '获取数据',
        // 要求返回一个list数组对象，page，pageSize，total
        method: 'POST',
        data
    })
}