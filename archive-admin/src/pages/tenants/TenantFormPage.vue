<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTenantStore } from '@/stores/tenant'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-vue-next'
import type { CreateTenantRequest } from '@/types/tenant'

const router = useRouter()
const route = useRoute()
const tenantStore = useTenantStore()

const isEdit = ref(false)
const tenantId = ref<string>('')
const loading = ref(false)

const formData = ref<CreateTenantRequest>({
  name: '',
  slug: '',
  domain: '',
  plan: 'free',
})

const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name) {
    errors.value.name = 'Name is required'
  }
  
  if (!formData.value.slug) {
    errors.value.slug = 'Slug is required'
  } else if (!/^[a-z0-9-]+$/.test(formData.value.slug)) {
    errors.value.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
  }
  
  if (formData.value.domain && !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.value.domain)) {
    errors.value.domain = 'Invalid domain format'
  }
  
  return Object.keys(errors.value).length === 0
}

const generateSlug = () => {
  if (formData.value.name && !formData.value.slug) {
    formData.value.slug = formData.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    if (isEdit.value) {
      await tenantStore.updateTenant(tenantId.value, formData.value)
    } else {
      await tenantStore.createTenant(formData.value)
    }
    
    router.push('/tenants')
  } catch (error) {
    console.error('Failed to save tenant:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    tenantId.value = id
    
    // Load tenant data
    try {
      const tenant = await tenantService.getTenantById(id)
      formData.value = {
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain || undefined,
        plan: tenant.plan,
      }
    } catch (error) {
      console.error('Failed to load tenant:', error)
      router.push('/tenants')
    }
  }
})
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="router.back()">
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          {{ isEdit ? 'Edit Tenant' : 'Create New Tenant' }}
        </h1>
        <p class="text-muted-foreground mt-1">
          {{ isEdit ? 'Update tenant information' : 'Set up a new tenant organization' }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <Card>
      <CardHeader>
        <CardTitle>Tenant Information</CardTitle>
        <CardDescription>Basic details about your tenant organization</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div class="space-y-2">
            <Label for="name">Tenant Name *</Label>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="My Organization"
              @blur="generateSlug"
              :class="errors.name ? 'border-red-500' : ''"
            />
            <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
            <p class="text-sm text-muted-foreground">The display name for your tenant</p>
          </div>

          <!-- Slug -->
          <div class="space-y-2">
            <Label for="slug">Slug *</Label>
            <Input
              id="slug"
              v-model="formData.slug"
              placeholder="my-organization"
              :class="errors.slug ? 'border-red-500' : ''"
            />
            <p v-if="errors.slug" class="text-sm text-red-500">{{ errors.slug }}</p>
            <p class="text-sm text-muted-foreground">
              URL-friendly identifier (lowercase, numbers, and hyphens only)
            </p>
          </div>

          <!-- Domain -->
          <div class="space-y-2">
            <Label for="domain">Custom Domain</Label>
            <Input
              id="domain"
              v-model="formData.domain"
              placeholder="example.com"
              :class="errors.domain ? 'border-red-500' : ''"
            />
            <p v-if="errors.domain" class="text-sm text-red-500">{{ errors.domain }}</p>
            <p class="text-sm text-muted-foreground">Optional custom domain for this tenant</p>
          </div>

          <!-- Plan -->
          <div class="space-y-2">
            <Label>Plan</Label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="plan in ['free', 'starter', 'professional', 'enterprise']"
                :key="plan"
                type="button"
                @click="formData.plan = plan"
                :class="[
                  'p-4 rounded-lg border-2 transition-all text-left',
                  formData.plan === plan
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                ]"
              >
                <p class="font-semibold capitalize">{{ plan }}</p>
                <p class="text-xs text-muted-foreground mt-1">
                  {{ plan === 'free' ? 'Basic features' : '' }}
                  {{ plan === 'starter' ? 'For small teams' : '' }}
                  {{ plan === 'professional' ? 'Advanced features' : '' }}
                  {{ plan === 'enterprise' ? 'Full access' : '' }}
                </p>
              </button>
            </div>
            <p class="text-sm text-muted-foreground">Choose the subscription plan</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-4">
            <Button type="submit" :disabled="loading" class="gap-2">
              <Save class="h-4 w-4" />
              {{ isEdit ? 'Update Tenant' : 'Create Tenant' }}
            </Button>
            <Button type="button" variant="outline" @click="router.back()">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
