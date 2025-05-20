import Layout from '@/layout'

export default {
  path: '/hrs',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Hrs',
  meta: { title: '人事管理', icon: 'peoples' },
  children: [
    {
      path: 'employee',
      component: () => import('@/views/hrs/employee/index'),
      name: 'Employee',
      meta: { title: '人员管理', icon: 'user' },
      children: [
        {
          path: 'education',
          component: () => import('@/views/hrs/employee/education/index'),
          name: 'Education',
          meta: { title: '教育背景', icon: 'education' }
        },
        {
          path: 'certificate',
          component: () => import('@/views/hrs/employee/certificate/index'),
          name: 'Certificate',
          meta: { title: '资格证执业证', icon: 'certificate' }
        }
      ]
    }
  ]
} 