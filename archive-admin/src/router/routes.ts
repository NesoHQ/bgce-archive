import MainLayout from '@/components/layouts/MainLayout.vue'
import LoginPage from '@/pages/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import TenantsPage from '@/pages/tenants/TenantsPage.vue'
import TenantFormPage from '@/pages/tenants/TenantFormPage.vue'
import CategoryHierarchyPage from '@/pages/archive/CategoryHierarchyPage.vue'
import PostListPage from '@/pages/posts/PostListPage.vue'
import PostEditorPage from '@/pages/posts/PostEditorPage.vue'
import CommentModerationPage from '@/pages/comments/CommentModerationPage.vue'
import SupportTicketsPage from '@/pages/support/SupportTicketsPage.vue'
import SupportTicketDetailPage from '@/pages/support/SupportTicketDetailPage.vue'
import ProfilePage from '@/pages/profile/ProfilePage.vue'

export const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true, title: 'Dashboard' },
      },
      {
        path: 'tenants',
        name: 'tenants',
        component: TenantsPage,
        meta: { requiresAuth: true, title: 'Tenants' },
      },
      {
        path: 'tenants/new',
        name: 'tenant-create',
        component: TenantFormPage,
        meta: { requiresAuth: true, title: 'Create Tenant' },
      },
      {
        path: 'tenants/:id/edit',
        name: 'tenant-edit',
        component: TenantFormPage,
        meta: { requiresAuth: true, title: 'Edit Tenant' },
      },
      {
        path: 'categories',
        name: 'categories',
        component: CategoryHierarchyPage,
        meta: { requiresAuth: true, title: 'Categories' },
      },
      {
        path: 'posts',
        name: 'posts',
        component: PostListPage,
        meta: { requiresAuth: true, title: 'Posts' },
      },
      {
        path: 'posts/new',
        name: 'post-create',
        component: PostEditorPage,
        meta: { requiresAuth: true, title: 'Create Post' },
      },
      {
        path: 'posts/:id/edit',
        name: 'post-edit',
        component: PostEditorPage,
        meta: { requiresAuth: true, title: 'Edit Post' },
      },
      {
        path: 'comments',
        name: 'comments',
        component: CommentModerationPage,
        meta: { requiresAuth: true, title: 'Comment Moderation' },
      },
      {
        path: 'support',
        name: 'support',
        component: SupportTicketsPage,
        meta: { requiresAuth: true, title: 'Support Tickets' },
      },
      {
        path: 'support/:id',
        name: 'support-detail',
        component: SupportTicketDetailPage,
        meta: { requiresAuth: true, title: 'Ticket Details' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfilePage,
        meta: { requiresAuth: true, title: 'Profile' },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: 'Login' },
  },
]
