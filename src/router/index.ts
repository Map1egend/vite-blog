import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: () => import('../layouts/DrawBoard.vue') },
  { path: '/home', component: () => import('@views/HomePage.vue') },
  { path: '/blog', component: () => import('@views/BlogPage.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
