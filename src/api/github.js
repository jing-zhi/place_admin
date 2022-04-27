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
    headers: {
      'Authorization': 'token 48b1efb455c6a56dc9972a6c57815b1adafc6ca6',
    },
    data
  })
}
