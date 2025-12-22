import { createRouter, createWebHistory } from 'vue-router'
import Hi from './pages/Hi.vue'
import Home from './pages/index.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:all(.*)',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/hi/:name',
    name: 'Hi',
    component: Hi,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
