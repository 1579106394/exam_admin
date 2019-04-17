import request from '@/utils/request'
var group_name = 'bankKnowledge'
export default {
  save(knowledge) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: knowledge
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  get(knowId) {
    return request({
      url: `/${group_name}/get/${knowId}`,
      method: 'get'
    })
  },
  update(knowledge) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: knowledge
    })
  },
  delete(knowId) {
    return request({
      url: `/${group_name}/delete/${knowId}`,
      method: 'delete'
    })
  }
}
