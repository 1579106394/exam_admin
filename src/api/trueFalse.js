import request from '@/utils/request'
var group_name = 'trueFalse'
export default {
  save(trueFalse) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: trueFalse
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  delete(tfId) {
    return request({
      url: `/${group_name}/delete/${tfId}`,
      method: 'delete'
    })
  },
  get(tfId) {
    return request({
      url: `/${group_name}/get/${tfId}`,
      method: 'get'
    })
  },
  update(trueFalse) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: trueFalse
    })
  }
}
