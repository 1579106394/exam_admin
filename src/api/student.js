import request from '@/utils/request'
var group_name = 'student'
export default {

  save(student) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: student
    })
  },
  update(student) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: student
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  get(stuId) {
    return request({
      url: `/${group_name}/get/${stuId}`,
      method: 'get'
    })
  },
  delete(stuId) {
    return request({
      url: `/${group_name}/delete/${stuId}`,
      method: 'delete'
    })

  },
  all(obj) {
    return request({
      url: `/${group_name}/all`,
      method: 'post',
      data: obj
    })
  },

}
