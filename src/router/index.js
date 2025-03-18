import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '@/views/BaseLayout.vue'
import { authStore } from "@/stories/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseLayout,
      children: [
          {
              path: '/',
              name: 'dashboard',
              meta: {
                title: 'СИБДСП | Дашборд'
              },
              component: () => import('@/views/dashboard/DashboardView.vue')
          },
          {
              path: '/detail/:source',
              name: 'detail',
              meta: {
                title: 'СИБДСП | Детализация'
              },
              component: () => import('@/views/dashboard/DetailView.vue')
          },
          {
              path: '/admin/logs',
              name: 'logs',
              meta: {
                title: 'СИБДСП | Просмотр логов'
              },
              component: () => import('@/views/admin/LogsView.vue')
          },
          // TODO в плане реализации
          // {
          //     path: '/admin/streams',
          //     name: 'streams',
          //     meta: {
          //       title: 'СИБДСП | Настройка потоков файлов'
          //     },
          //     component: () => import('@/views/admin/StreamView.vue')
          // },
          {
              path: '/admin/users',
              name: 'users',
              meta: {
                title: 'СИБДСП | Управление пользователями'
              },
              component: () => import('@/views/admin/UsersView.vue')
          },
      ]
  },
  {
      path: '/auth/login',
      name: 'login',
      meta: {
        title: 'СИБДСП | Логин'
      },
      component: () => import('@/views/auth/LoginView.vue')
  },
  {
      path: '/auth/access',
      name: 'accessDenied',
      component: () => import('@/views/auth/AccessDenied.vue')
  }],
})

router.beforeEach((to, from, next) => {
  const {isAuth} = authStore();
  if (to.name !== "login"&&!isAuth) {
    next({ name: "login" });
  } else {
    next();
  }
});

router.afterEach((to)=>{
  const title = to.meta.title || "СИБДСП"
  document.title = title
})

export default router
