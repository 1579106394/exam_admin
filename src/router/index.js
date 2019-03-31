import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 下面导入路由 */
import dashboard from '@/views/dashboard/index'

/* Layout */
import Layout from '../views/layout/Layout'
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dict/college',
    name: 'dashboard',
    meta: { title: '首页', icon: 'example' },
    hidden: true,
    children: [{
      path: 'dashboard',
      component: dashboard
    }]
  },

  {
    path: '/dict',
    component: Layout,
    redirect: '/dict/college',
    name: 'dict',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'college',
        name: 'college',
        component: () => import('@/views/components/dict/college/CollegeList'),
        meta: { title: '学院管理', icon: 'table' }
      },
      {
        path: 'major',
        name: 'major',
        component: () => import('@/views/components/dict/major/MajorList'),
        meta: { title: '专业管理', icon: 'table' }
      },
      {
        path: 'job',
        name: 'job',
        component: () => import('@/views/components/dict/job/JobList'),
        meta: { title: '职务管理', icon: 'table' }
      },
      {
        path: 'title',
        name: 'title',
        component: () => import('@/views/components/dict/title/TitleList'),
        meta: { title: '职称管理', icon: 'table' }
      },
      {
        path: 'subject',
        name: 'subject',
        component: () => import('@/views/components/dict/subject/SubjectList'),
        meta: { title: '科目管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/bank',
    component: Layout,
    redirect: '/bank/bank',
    name: 'bank',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'bank',
        name: 'bank',
        component: () => import('@/views/components/bank/bank/BankList'),
        meta: { title: '题库管理', icon: 'table' }
      },
      {
        path: 'type',
        name: 'type',
        component: () => import('@/views/components/bank/type/TypeList'),
        meta: { title: '题型管理', icon: 'table' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
