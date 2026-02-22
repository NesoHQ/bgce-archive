<script setup lang="ts">
import { computed } from 'vue'
import { useTenantStore } from '@/stores/tenant'
import { Building2, AlertCircle } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const tenantStore = useTenantStore()
const router = useRouter()

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
  <div 
    v-if="!tenantStore.currentTenant"
    class="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800"
  >
    <AlertCircle class="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
    <div class="flex-1">
      <p class="text-sm font-medium text-yellow-900 dark:text-yellow-100">No tenant selected</p>
      <p class="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
        Please select a tenant to manage content
      </p>
    </div>
    <Button size="sm" variant="outline" @click="router.push('/tenants')">
      Select Tenant
    </Button>
  </div>
  
  <div 
    v-else
    class="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
  >
    <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
      <Building2 class="h-5 w-5 text-white" />
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <p class="text-sm font-semibold truncate">{{ tenantStore.currentTenant.name }}</p>
        <Badge :class="getPlanColor(tenantStore.currentTenant.plan)" class="text-xs capitalize">
          {{ tenantStore.currentTenant.plan }}
        </Badge>
      </div>
      <p class="text-xs text-muted-foreground truncate">
        {{ tenantStore.currentTenant.slug }}
        <span v-if="tenantStore.currentTenant.domain"> · {{ tenantStore.currentTenant.domain }}</span>
      </p>
    </div>
    <Button size="sm" variant="ghost" @click="router.push('/tenants')">
      Switch
    </Button>
  </div>
</template>
