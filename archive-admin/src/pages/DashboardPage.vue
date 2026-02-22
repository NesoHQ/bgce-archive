<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FolderTree, FileText, MessageSquare, HeadphonesIcon, TrendingUp, Clock, Loader2, Building2, Users } from 'lucide-vue-next'
import { useCategoryStore } from '@/stores/category'
import { usePostStore } from '@/stores/post'
import { useCommentStore } from '@/stores/comment'
import { useSupportStore } from '@/stores/support'
import { useTenantStore } from '@/stores/tenant'
import { statsService } from '@/services/statsService'
import { Badge } from '@/components/ui/badge'

const categoryStore = useCategoryStore()
const postStore = usePostStore()
const commentStore = useCommentStore()
const supportStore = useSupportStore()
const tenantStore = useTenantStore()

const loading = ref(true)
const stats = ref({
  categories: 0,
  subcategories: 0,
  posts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  archivedPosts: 0,
  pendingComments: 0,
  openTickets: 0,
})

const currentTenantName = computed(() => tenantStore.currentTenant?.name || 'No Tenant Selected')
const currentTenantPlan = computed(() => tenantStore.currentTenant?.plan || 'free')

const recentActivity = computed(() => {
  const activities: any[] = []
  
  // Add recent posts
  const recentPosts = postStore.posts.slice(0, 2)
  recentPosts.forEach(post => {
    activities.push({
      type: 'post',
      action: post.status,
      title: post.title,
      time: getRelativeTime(post.updated_at || post.created_at),
    })
  })
  
  // Add recent comments (if available)
  const recentComments = commentStore.comments.slice(0, 1)
  recentComments.forEach(comment => {
    activities.push({
      type: 'comment',
      action: comment.status,
      title: `Comment by ${comment.author_name}`,
      time: getRelativeTime(comment.created_at),
    })
  })
  
  // Add recent tickets (if available)
  const recentTickets = supportStore.tickets.slice(0, 1)
  recentTickets.forEach(ticket => {
    activities.push({
      type: 'ticket',
      action: ticket.status,
      title: `Support ticket #${ticket.id}`,
      time: getRelativeTime(ticket.created_at),
    })
  })
  
  return activities.length > 0 ? activities : [
    { type: 'post', action: 'published', title: 'No recent activity', time: 'Start creating content!' },
  ]
})

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

onMounted(async () => {
  loading.value = true
  try {
    // Fetch all data in parallel
    await Promise.all([
      categoryStore.fetchCategories(),
      postStore.fetchPosts(),
      commentStore.fetchComments({ status: 'pending' }),
      supportStore.fetchTickets({ status: 'open' }),
    ])

    // Get comprehensive stats
    const dashboardStats = await statsService.getDashboardStats()
    stats.value = dashboardStats
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
})

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'post': return FileText
    case 'comment': return MessageSquare
    case 'ticket': return HeadphonesIcon
    default: return Clock
  }
}

const getActivityColor = (action: string) => {
  switch (action) {
    case 'published': return 'text-green-600'
    case 'approved': return 'text-blue-600'
    case 'resolved': return 'text-purple-600'
    case 'pending': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

const getPlanColor = (plan: string) => {
  switch (plan) {
    case 'enterprise': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'professional': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'starter': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header with Tenant Context -->
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-4xl font-bold tracking-tight">Dashboard</h1>
          <Badge :class="getPlanColor(currentTenantPlan)" class="capitalize">
            {{ currentTenantPlan }}
          </Badge>
        </div>
        <p class="text-muted-foreground">
          Managing <span class="font-semibold">{{ currentTenantName }}</span> · Welcome back!
        </p>
      </div>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock class="h-4 w-4" />
        <span>{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
      </div>
    </div>

    <!-- Tenant Quick Info -->
    <Card v-if="tenantStore.currentTenant" class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <CardContent class="pt-6">
        <div class="flex items-center gap-6">
          <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Building2 class="h-8 w-8 text-white" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold">{{ tenantStore.currentTenant.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ tenantStore.currentTenant.slug }}</p>
            <div v-if="tenantStore.currentTenant.domain" class="text-sm text-muted-foreground mt-1">
              Domain: {{ tenantStore.currentTenant.domain }}
            </div>
          </div>
          <div class="text-right">
            <Badge :class="getPlanColor(currentTenantPlan)" class="text-sm capitalize mb-2">
              {{ currentTenantPlan }} Plan
            </Badge>
            <p class="text-xs text-muted-foreground">Domain-based tenant</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stats Grid -->
    <div v-if="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="i in 4" :key="i" class="animate-pulse">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <div class="h-4 w-24 bg-muted rounded"></div>
          <div class="h-10 w-10 rounded-full bg-muted"></div>
        </CardHeader>
        <CardContent>
          <div class="h-8 w-16 bg-muted rounded"></div>
          <div class="h-3 w-32 bg-muted rounded mt-2"></div>
        </CardContent>
      </Card>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <!-- Total Posts -->
      <Card class="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
          <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FileText class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats.posts }}</div>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              <TrendingUp class="h-3 w-3" />
              {{ stats.publishedPosts }} published
            </span>
          </div>
        </CardContent>
      </Card>

      <!-- Categories -->
      <Card class="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          <div class="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <FolderTree class="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats.categories }}</div>
          <p class="text-xs text-muted-foreground mt-2">{{ stats.subcategories }} subcategories</p>
        </CardContent>
      </Card>

      <!-- Draft Posts -->
      <Card class="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Draft Posts</CardTitle>
          <div class="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Clock class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats.draftPosts }}</div>
          <p class="text-xs text-muted-foreground mt-2">Work in progress</p>
        </CardContent>
      </Card>

      <!-- Archived Posts -->
      <Card class="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Archived</CardTitle>
          <div class="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <FileText class="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats.archivedPosts }}</div>
          <p class="text-xs text-muted-foreground mt-2">Archived posts</p>
        </CardContent>
      </Card>
    </div>

    <!-- Content Grid -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Recent Activity -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle class="text-xl">Recent Activity</CardTitle>
          <CardDescription>Latest updates across your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div 
              v-for="(activity, index) in recentActivity" 
              :key="index"
              class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <component :is="getActivityIcon(activity.type)" class="h-5 w-5" :class="getActivityColor(activity.action)" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm">{{ activity.title }}</p>
                <p class="text-xs text-muted-foreground mt-1">
                  <span class="capitalize" :class="getActivityColor(activity.action)">{{ activity.action }}</span>
                  · {{ activity.time }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle class="text-xl">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <router-link 
            to="/posts/new" 
            class="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <FileText class="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p class="font-medium text-sm">Create New Post</p>
              <p class="text-xs text-muted-foreground">Write and publish content</p>
            </div>
          </router-link>

          <router-link 
            to="/categories" 
            class="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FolderTree class="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p class="font-medium text-sm">Manage Categories</p>
              <p class="text-xs text-muted-foreground">Organize your content</p>
            </div>
          </router-link>

          <router-link 
            to="/comments" 
            class="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div class="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <MessageSquare class="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p class="font-medium text-sm">Moderate Comments</p>
              <p class="text-xs text-muted-foreground">Review pending comments</p>
            </div>
          </router-link>

          <router-link 
            to="/support" 
            class="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div class="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <HeadphonesIcon class="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p class="font-medium text-sm">Support Tickets</p>
              <p class="text-xs text-muted-foreground">Help your users</p>
            </div>
          </router-link>
        </CardContent>
      </Card>
    </div>

    <!-- Categories Overview -->
    <Card>
      <CardHeader>
        <CardTitle class="text-xl">Categories Overview</CardTitle>
        <CardDescription>Your content organization structure</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div 
            v-for="category in categoryStore.categories.slice(0, 4)" 
            :key="category.id"
            class="p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer"
            @click="$router.push('/categories')"
          >
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FolderTree class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm truncate">{{ category.label }}</p>
                <p class="text-xs text-muted-foreground">{{ category.slug }}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
