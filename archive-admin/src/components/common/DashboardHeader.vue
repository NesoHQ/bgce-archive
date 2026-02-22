<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Search, Settings } from 'lucide-vue-next'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const notifications = ref([
  { id: 1, title: 'New comment pending', time: '5 min ago', unread: true },
  { id: 2, title: 'Post published successfully', time: '1 hour ago', unread: true },
  { id: 3, title: 'Support ticket resolved', time: '2 hours ago', unread: false },
])

const unreadCount = ref(notifications.value.filter(n => n.unread).length)
</script>

<template>
  <header class="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
    <SidebarTrigger class="lg:hidden" />
    
    <!-- Search -->
    <div class="flex-1 max-w-md">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search posts, comments, tickets..." 
          class="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- Notifications -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="h-9 w-9 rounded-full relative">
            <Bell class="h-4 w-4" />
            <Badge 
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500"
            >
              {{ unreadCount }}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-80">
          <div class="flex items-center justify-between px-4 py-3 border-b">
            <h3 class="font-semibold text-sm">Notifications</h3>
            <Button variant="ghost" size="sm" class="h-auto p-0 text-xs text-primary">
              Mark all read
            </Button>
          </div>
          <div class="max-h-[300px] overflow-y-auto">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              class="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
              :class="notification.unread ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''"
            >
              <div 
                class="h-2 w-2 rounded-full mt-2 flex-shrink-0"
                :class="notification.unread ? 'bg-blue-500' : 'bg-transparent'"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium">{{ notification.title }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ notification.time }}</p>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div class="px-4 py-3">
            <Button variant="ghost" size="sm" class="w-full text-xs">
              View all notifications
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Settings -->
      <Button 
        variant="ghost" 
        size="icon" 
        class="h-9 w-9 rounded-full"
        @click="$router.push('/profile')"
      >
        <Settings class="h-4 w-4" />
      </Button>
    </div>
  </header>
</template>
