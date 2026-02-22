<script setup lang="ts">
import { computed } from 'vue'
import { Check, ChevronsUpDown, Plus, Building2 } from 'lucide-vue-next'
import { useTenantStore } from '@/stores/tenant'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

const handleCreateTenant = () => {
  router.push('/tenants/new')
}

const handleManageTenants = () => {
  router.push('/tenants')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button 
        variant="outline" 
        class="w-full justify-between gap-2 h-auto py-2.5 px-3 hover:bg-muted"
      >
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Building2 class="h-4 w-4 text-white" />
          </div>
          <div class="flex-1 min-w-0 text-left">
            <p class="text-sm font-semibold truncate">
              {{ tenantStore.currentTenant?.name || 'Select Tenant' }}
            </p>
            <p class="text-xs text-muted-foreground truncate">
              {{ tenantStore.currentTenant?.slug || 'No tenant selected' }}
            </p>
          </div>
        </div>
        <ChevronsUpDown class="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </Button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent align="start" class="w-[280px]">
      <DropdownMenuLabel class="text-xs font-semibold text-muted-foreground uppercase">
        Your Tenants
      </DropdownMenuLabel>
      
      <div class="max-h-[300px] overflow-y-auto">
        <DropdownMenuItem
          v-for="tenant in tenantStore.activeTenants"
          :key="tenant.id"
          @click="tenantStore.switchTenant(tenant.id)"
          class="flex items-center gap-3 py-3 cursor-pointer"
        >
          <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Building2 class="h-4 w-4 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium truncate">{{ tenant.name }}</p>
              <Badge 
                :class="getPlanColor(tenant.plan)"
                class="text-xs px-1.5 py-0"
              >
                {{ tenant.plan }}
              </Badge>
            </div>
            <p class="text-xs text-muted-foreground truncate">{{ tenant.slug }}</p>
          </div>
          <Check 
            v-if="tenantStore.currentTenant?.id === tenant.id"
            class="h-4 w-4 text-primary flex-shrink-0" 
          />
        </DropdownMenuItem>
      </div>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem @click="handleCreateTenant" class="cursor-pointer">
        <Plus class="h-4 w-4 mr-2" />
        <span>Create New Tenant</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem @click="handleManageTenants" class="cursor-pointer">
        <Building2 class="h-4 w-4 mr-2" />
        <span>Manage Tenants</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
