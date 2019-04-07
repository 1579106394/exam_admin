import request from '@/utils/request'
var group_name = 'teacherRole'
export default {
  roleList(teacherId) {
    return request({
      url: `/${group_name}/roleList/${teacherId}`,
      method: 'get'
    })
  },
  update(teacherRoles) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: teacherRoles
    })
  }
}
