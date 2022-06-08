import service from '@/utils/request'

// 人员状态统计
export const getWorkerState = () => {
    return service({
        url: '/cdworker/countHeSuan',
        method: 'post'
    })
}
