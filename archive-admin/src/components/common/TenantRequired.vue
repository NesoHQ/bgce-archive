<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Plus, ArrowRight } from 'lucide-vue-next'

const tenantStore = useTenantStore()
const router = useRouter()

const handleSelectTenant = () => {
  router.push('/tenants')
}

const handleCreateTenant = () => {
  router.push('/tenants/new')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <Card class="max-w-md w-full">
      <CardHeader class="text-center">
        <div class="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
          <Building2 class="h-8 w-8 text-white" />
        </div>
        <CardTitle class="text-2xl">No Tenant Selected</CardTitle>
        <CardDescription class="text-base">
          Please select a tenant to continue managing your content
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-if="tenantStore.tenants.length > 0" class="space-y-3">
          <p class="text-sm text-muted-foreground text-center">
            You have {{ tenantStore.tenants.length }} tenant{{ tenantStore.tenants.length > 1 ? 's' : '' }} available
          </p>
          <Button @click="handleSelectTenant" class="w-full gap-2" size="lg">
            <Building2 class="h-4 w-4" />
            Select Tenant
            <ArrowRight class="h-4 w-4 ml-auto" />
          </Button>
        </div>
        
        <div v-else class="space-y-3">
          <p class="text-sm text-muted-foreground text-center">
            You don't have any tenants yet. Create your first tenant to get started.
          </p>
          <Button @click="handleCreateTenant" class="w-full gap-2" size="lg">
            <Plus class="h-4 w-4" />
            Create Your First Tenant
            <ArrowRight class="h-4 w-4 ml-auto" />
          </Button>
        </div>

        <div class="pt-4 border-t">
          <p class="text-xs text-muted-foreground text-center">
            Tenants allow you to manage multiple organizations with isolated content and settings
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
