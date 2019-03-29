import request from '@/utils/request'
var group_name = 'dict'
export default {
  save(college) {
    // 保存或修改
    if (college.dictId === '') {
      return request({
        url: `/${group_name}/add`,
        method: 'post',
        data: college
      })
    } else {
      return request({
        url: `/${group_name}/update`,
        method: 'put',
        data: college
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
  all(college) {
    return request({
      url: `/${group_name}/all`,
      method: 'post',
      data: college
    })
  },
  getByFather(id) {
    // 根据父级id查询
    return request({
      url: `/${group_name}/childList/${id}`,
      method: 'get'
    })
  }
}
