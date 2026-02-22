<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTenantStore } from '@/stores/tenant'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Building2, Plus, Search, MoreVertical, Edit, Trash2, Settings, ExternalLink } from 'lucide-vue-next'
import { useConfirm } from '@/composables/useConfirm'

const router = useRouter()
const tenantStore = useTenantStore()
const { confirm } = useConfirm()

const searchQuery = ref('')

const filteredTenants = computed(() => {
  if (!searchQuery.value) return tenantStore.tenants
  
  const query = searchQuery.value.toLowerCase()
  return tenantStore.tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(query) ||
    tenant.slug.toLowerCase().includes(query) ||
    tenant.domain?.toLowerCase().includes(query)
  )
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default: return 'bg-gray-100 text-gray-700'
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

const handleEdit = (tenantUuid: string) => {
  router.push(`/tenants/${tenantUuid}/edit`)
}

const handleDelete = async (tenantUuid: string, tenantName: string) => {
  const confirmed = await confirm({
    title: 'Delete Tenant',
    message: `Are you sure you want to delete "${tenantName}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
  })

  if (confirmed) {
    await tenantStore.deleteTenant(tenantUuid)
  }
}

const handleSwitch = (tenantUuid: string) => {
  tenantStore.switchTenant(tenantUuid)
}

onMounted(() => {
  tenantStore.fetchTenants()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Tenants</h1>
        <p class="text-muted-foreground mt-1">Manage your multi-tenant organizations</p>
      </div>
      <Button @click="router.push('/tenants/new')" class="gap-2">
        <Plus class="h-4 w-4" />
        Create Tenant
      </Button>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          v-model="searchQuery"
          placeholder="Search tenants..." 
          class="pl-10"
        />
      </div>
    </div>

    <!-- Tenants Grid -->
    <div v-if="tenantStore.loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="i in 6" :key="i" class="animate-pulse">
        <CardHeader>
          <div class="h-6 w-32 bg-muted rounded"></div>
          <div class="h-4 w-24 bg-muted rounded mt-2"></div>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="h-4 w-full bg-muted rounded"></div>
            <div class="h-4 w-3/4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="filteredTenants.length === 0" class="text-center py-12">
      <Building2 class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-semibold mb-2">No tenants found</h3>
      <p class="text-muted-foreground mb-4">
        {{ searchQuery ? 'Try adjusting your search' : 'Get started by creating your first tenant' }}
      </p>
      <Button v-if="!searchQuery" @click="router.push('/tenants/new')" class="gap-2">
        <Plus class="h-4 w-4" />
        Create Tenant
      </Button>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card 
        v-for="tenant in filteredTenants" 
        :key="tenant.uuid"
        class="hover:shadow-lg transition-shadow relative group"
        :class="tenantStore.currentTenant?.uuid === tenant.uuid ? 'ring-2 ring-primary' : ''"
      >
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Building2 class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <CardTitle class="text-lg truncate">{{ tenant.name }}</CardTitle>
                <CardDescription class="truncate">{{ tenant.slug }}</CardDescription>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="h-8 w-8">
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click.stop="handleSwitch(tenant.uuid)">
                  <ExternalLink class="h-4 w-4 mr-2" />
                  Switch to this tenant
                </DropdownMenuItem>
                <DropdownMenuItem @click.stop="handleEdit(tenant.uuid)">
                  <Edit class="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  @click.stop="handleDelete(tenant.uuid, tenant.name)"
                  class="text-red-600"
                >
                  <Trash2 class="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent class="space-y-4">
          <div class="flex items-center gap-2">
            <Badge :class="getStatusColor(tenant.status)" class="capitalize">
              {{ tenant.status }}
            </Badge>
            <Badge :class="getPlanColor(tenant.plan)" class="capitalize">
              {{ tenant.plan }}
            </Badge>
            <Badge 
              v-if="tenantStore.currentTenant?.uuid === tenant.uuid"
              class="bg-primary text-primary-foreground"
            >
              Current
            </Badge>
          </div>
          
          <div v-if="tenant.domain" class="text-sm text-muted-foreground">
            <span class="font-medium">Domain:</span> {{ tenant.domain }}
          </div>
          
          <div v-if="tenant.stats" class="grid grid-cols-3 gap-2 pt-2 border-t">
            <div class="text-center">
              <p class="text-lg font-bold">{{ tenant.stats.total_posts }}</p>
              <p class="text-xs text-muted-foreground">Posts</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold">{{ tenant.stats.total_users }}</p>
              <p class="text-xs text-muted-foreground">Users</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold">{{ tenant.stats.total_categories }}</p>
              <p class="text-xs text-muted-foreground">Categories</p>
            </div>
          </div>
          
          <div class="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              class="flex-1"
              @click.stop="handleEdit(tenant.uuid)"
            >
              <Settings class="h-3 w-3 mr-1" />
              Settings
            </Button>
            <Button 
              v-if="tenantStore.currentTenant?.uuid !== tenant.uuid"
              size="sm" 
              class="flex-1"
              @click.stop="handleSwitch(tenant.uuid)"
            >
              Switch
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
