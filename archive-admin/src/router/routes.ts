import AboutPage from '@/pages/AboutPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import MainLayout from '@/components/layouts/MainLayout.vue'
import LoginPage from '@/pages/LoginPage.vue'
import CategoryPage from '@/pages/archive/CategoryPage.vue'

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
        path: 'archive',
        name: 'archive',
        meta: { requiresAuth: true },
        // Define children here:
        children: [
          {
            path: 'categories',
            name: 'archive-categories',
            component: CategoryPage,
            // meta: { requiresAuth: true },
          },
        ],
      },
      //   {
      //     path: 'about',
      //     name: 'about',
      //     component: AboutPage,
      //     meta: { requiresAuth: true },
      //   },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
]
