import request from '@/utils/request'
var group_name = 'choice'
export default {
  save(choice) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: choice
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  delete(choiceId) {
    return request({
      url: `/${group_name}/delete/${choiceId}`,
      method: 'delete'
    })
  },
  get(choiceId) {
    return request({
      url: `/${group_name}/get/${choiceId}`,
      method: 'get'
    })
  },
  update(choice) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: choice
    })
  }
}
