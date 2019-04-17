import request from '@/utils/request'
var group_name = 'completion'
export default {
  save(completion) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: completion
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  delete(compId) {
    return request({
      url: `/${group_name}/delete/${compId}`,
      method: 'delete'
    })
  },
  get(compId) {
    return request({
      url: `/${group_name}/get/${compId}`,
      method: 'get'
    })
  },
  update(completion) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: completion
    })
  }
}
