<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutDashboard, FolderTree, FileText, MessageSquare, HeadphonesIcon, User, LogOut, Building2 } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'
import TenantSwitcher from './TenantSwitcher.vue'

const authStore = useAuthStore()
const tenantStore = useTenantStore()
const route = useRoute()

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/',
    badge: null,
  },
  {
    title: 'Categories',
    icon: FolderTree,
    url: '/categories',
    badge: null,
  },
  {
    title: 'Posts',
    icon: FileText,
    url: '/posts',
    badge: '3',
  },
  {
    title: 'Comments',
    icon: MessageSquare,
    url: '/comments',
    badge: '5',
  },
  {
    title: 'Support',
    icon: HeadphonesIcon,
    url: '/support',
    badge: '2',
  },
]

// Admin-only menu items
const adminMenuItems = [
  {
    title: 'Tenants',
    icon: Building2,
    url: '/tenants',
    badge: null,
  },
]

const isActive = (url: string) => {
  if (url === '/') return route.path === '/'
  return route.path.startsWith(url)
}
</script>

<template>
  <Sidebar class="border-r">
    <SidebarHeader class="border-b px-4 py-4 space-y-4">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
          <span class="text-white font-bold text-lg">A</span>
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="font-bold text-base">Archive Admin</h2>
          <p class="text-xs text-muted-foreground">Multi-Tenant CMS</p>
        </div>
      </div>
      
      <!-- Tenant Switcher -->
      <TenantSwitcher />
    </SidebarHeader>

    <SidebarContent class="px-3 py-4">
      <SidebarGroup>
        <SidebarGroupLabel class="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Main Menu
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="space-y-1">
            <SidebarMenuItem v-for="item in menuItems" :key="item.title">
              <SidebarMenuButton 
                as-child
                :class="[
                  'relative group',
                  isActive(item.url) 
                    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' 
                    : 'hover:bg-muted'
                ]"
              >
                <router-link :to="item.url" class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all">
                  <component 
                    :is="item.icon" 
                    :class="[
                      'h-5 w-5 transition-transform group-hover:scale-110',
                      isActive(item.url) ? 'text-primary-foreground' : 'text-muted-foreground'
                    ]" 
                  />
                  <span class="font-medium text-sm">{{ item.title }}</span>
                  <span 
                    v-if="item.badge" 
                    :class="[
                      'ml-auto text-xs font-semibold px-2 py-0.5 rounded-full',
                      isActive(item.url) 
                        ? 'bg-primary-foreground/20 text-primary-foreground' 
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    ]"
                  >
                    {{ item.badge }}
                  </span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <!-- Admin Section -->
      <SidebarGroup v-if="tenantStore.isAdmin">
        <SidebarGroupLabel class="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">
          Administration
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="space-y-1">
            <SidebarMenuItem v-for="item in adminMenuItems" :key="item.title">
              <SidebarMenuButton 
                as-child
                :class="[
                  'relative group',
                  isActive(item.url) 
                    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' 
                    : 'hover:bg-muted'
                ]"
              >
                <router-link :to="item.url" class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all">
                  <component 
                    :is="item.icon" 
                    :class="[
                      'h-5 w-5 transition-transform group-hover:scale-110',
                      isActive(item.url) ? 'text-primary-foreground' : 'text-muted-foreground'
                    ]" 
                  />
                  <span class="font-medium text-sm">{{ item.title }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <!-- Tenant Context Info -->
      <div v-if="tenantStore.currentTenant" class="mx-3 mt-6 p-3 rounded-lg bg-muted/50 border border-border">
        <p class="text-xs font-semibold text-muted-foreground mb-2">Current Tenant</p>
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground">Plan</span>
            <span class="font-medium capitalize">{{ tenantStore.currentTenant.plan }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground">Status</span>
            <span 
              class="font-medium capitalize"
              :class="tenantStore.currentTenant.status === 'active' ? 'text-green-600' : 'text-yellow-600'"
            >
              {{ tenantStore.currentTenant.status }}
            </span>
          </div>
        </div>
      </div>
    </SidebarContent>

    <SidebarFooter class="border-t p-4">
      <div class="space-y-2">
        <router-link 
          to="/profile" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
        >
          <div class="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <User class="h-5 w-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold truncate">{{ authStore.user?.full_name || 'User' }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ authStore.user?.email }}</p>
          </div>
        </router-link>
        
        <button 
          @click="authStore.logout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium text-muted-foreground"
        >
          <LogOut class="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>
