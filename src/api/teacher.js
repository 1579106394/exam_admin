import request from '@/utils/request'
var group_name = 'teacher'
export default {
  login(teacher) {
    return request({
      url: `/${group_name}/login`,
      method: 'post',
      data: teacher
    })
  },
  save(teacher) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: teacher
    })
  },
  update(teacher) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: teacher
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  get(teacherId) {
    return request({
      url: `/${group_name}/get/${teacherId}`,
      method: 'get'
    })
  },
  delete(teacherId) {
    return request({
      url: `/${group_name}/delete/${teacherId}`,
      method: 'delete'
    })

  },
  all(college) {
    return request({
      url: `/${group_name}/all`,
      method: 'post',
      data: college
    })
  },

}
