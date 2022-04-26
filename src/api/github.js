import axios from 'axios'

const service = axios.create()

export function Commits(page) {
  return service({
    url: 'https://api.github.com/repos/flipped-aurora/gin-vue-admin/commits?page=' + page,
    method: 'get'
  })
}

export function Members(data) {
  return service({
    url: 'https://gosword.cppwnn.top/open-api',
    method: 'post',
    data
  })
}
