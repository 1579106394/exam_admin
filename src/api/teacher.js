import request from '@/utils/request'
var group_name = 'teacher'
export default {
  login(teacher) {
    return request({
      url: `/${group_name}/login`,
      method: 'post',
      data: teacher
    })
  }
}
