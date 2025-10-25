import AboutPage from '@/pages/AboutPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import MainLayout from '@/components/layouts/MainLayout.vue'
import LoginPage from '@/pages/LoginPage.vue'

export const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'about',
        name: 'about',
        component: AboutPage,
        meta: { requiresAuth: true },
      },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
]
