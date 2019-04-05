import request from '@/utils/request'
var group_name = 'role'
export default {
  save(role) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: role
    })
  },
  update(role) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: role
    })
  },
  all() {
    return request({
      url: `/${group_name}/all`,
      method: 'get'
    })
  },
  treeList() {
    return request({
      url: `/${group_name}/treeList`,
      method: 'get'
    })
  },
  get(roleId) {
    return request({
      url: `/${group_name}/get/${roleId}`,
      method: 'get'
    })
  },
  delete(roleId) {
    return request({
      url: `/${group_name}/delete/${roleId}`,
      method: 'delete'
    })
  }
}
