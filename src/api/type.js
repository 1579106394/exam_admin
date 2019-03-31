import request from '@/utils/request'
var group_name = 'type'
export default {
  save(type) {
    // 保存或修改
    if (type.typeId === '') {
      return request({
        url: `/${group_name}/add`,
        method: 'post',
        data: type
      })
    } else {
      return request({
        url: `/${group_name}/update`,
        method: 'put',
        data: type
      })
    }
  },
  list(page) {
    // 分页查询
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  get(id) {
    // 根据id查询
    return request({
      url: `/${group_name}/get/${id}`,
      method: 'get'
    })
  },
  delete(id) {
    // 根据id删除
    return request({
      url: `/${group_name}/delete/${id}`,
      method: 'delete'
    })
  },
  update(type) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: type
    })
  },

}
