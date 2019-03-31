import request from '@/utils/request'

export function login(teacher) {
  return request({
    url: '/teacher/login',
    method: 'post',
    data: teacher
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
