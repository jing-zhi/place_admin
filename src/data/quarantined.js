export const QrylbList = [
    { value: '境外人员' },
    { value: '密接人员' },
    { value: '次密接人员' },
    { value: '未管控红码人员' },
    { value: '中高风险地区人员' },
    {value:'其他应隔尽隔人员'},
]

export const Qform = {
    cd_id:'',
    glryxm: '',
    csbh: '',
    rylb: '',
    sfffrjry: '',
    gj: '',
    rjhbh: '',
    rjzjlx: '',
    rjzjhm: '',
    zjlx: '',
    zjhm: '',
    sjhm: '',
    gldfjbh: '',
    tzrxm: '',
    glkssj: '',
    yjjcglrq: '',
    gljssj: '',
    bz: '',
    sfjzym: '',
    sfyx: '',
    yxqxcs: '',
    yxqxxq: '',
    yxqxdz:'',
    cd_time: '',
    glzt: '',
    zcsj: '',
    zcdd: '',
    jsryxm: '',
    jsrdh: '',
    zcyy: ''
    
}
export const QgjList = [
    { value: '中国' },
    {value:'其他'}
]
export const QzjlxList = [
    { value: '身份证' },
    { value: '护照' },
    { value: '驾驶证' },
    { value: '其他' },
]
export const QcityList = [
    { lable: '郑州', value: '0' },
    { lable: '开封', value: '1' },
    { lable: '洛阳', value: '2' },
    { lable: '平顶山', value: '3'},
    { lable: '安阳', value: '4'},
    { lable: '鹤壁', value: '5'},
    { lable: '新乡', value: '6'},
    { lable: '焦作', value: '7'},
    { lable: '濮阳', value: '8'},
    { lable: '许昌', value: '9'},
    { lable: '漯河', value: '10'},
    { lable: '三门峡', value: '11' },
    { lable: '南阳', value: '12' },
    { lable: '商丘', value: '13' },
    { lable: '信阳', value: '14' },
    { lable: '周口', value: '15' },
    { lable: '驻马店', value: '16'},
    { lable: '济源示范区', value: '17' },
    { lable: '其他地市', value: '18'},
]
export const QglztList = [
    { lable: '隔离', value: '1' },
    { lable: '结束隔离', value: '0' },
    { lable: '转运', value: '2' },
]
export const Qshortcuts = [
    {
      text: '上周',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      },
    },
    {
      text: '上个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      },
    },
    {
      text: '上个季度',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      },
    },
    {
        text: '下周',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '下个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '下个季度',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]
export const QsearchList = {
    glryxm: '',
    rylb: '',
    gj: '',
    rjhbh: '',
    zjhm: '',
    sjhm: '',
    glfjbh: '',
    glsj: '',
    sfjzym: "",
    sfyx: '',
    glzt: '',
    gldfjbh:'',
}