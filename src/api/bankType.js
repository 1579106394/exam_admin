import request from '@/utils/request'
var group_name = 'bankType'
export default {
  save(bankType) {
    return request({
      url: `/${group_name}/addType`,
      method: 'post',
      data: bankType
    })
  },
  list(bankId) {
    return request({
      url: `/${group_name}/list/${bankId}`,
      method: 'get'
    })
  },
  delete(id) {
    return request({
      url: `/${group_name}/delete/${id}`,
      method: 'delete'
    })
  }
}
