import request from '@/utils/request'
var group_name = 'bank'
export default {
  save(bank) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: bank
    })
  },
  update(bank) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: bank
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  get(bankId) {
    return request({
      url: `/${group_name}/get/${bankId}`,
      method: 'get'
    })
  },
  delete(bankId) {
    return request({
      url: `/${group_name}/delete/${bankId}`,
      method: 'delete'
    })
  }
}
