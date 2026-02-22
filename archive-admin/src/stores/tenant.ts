import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { tenantService } from '@/services/tenantService'
import type { Tenant, CreateTenantRequest, UpdateTenantRequest } from '@/types/tenant'

export const useTenantStore = defineStore('tenant', () => {
    const tenants = ref<Tenant[]>([])
    const currentTenant = ref<Tenant | null>(null)
    const loading = ref(false)

    const activeTenants = computed(() =>
        tenants.value.filter(t => t.status === 'active')
    )

    const hasTenants = computed(() => tenants.value.length > 0)
    const isAdmin = computed(() => true) // TODO: Check if user has admin role from auth store

    /**
     * Detect tenant from current domain
     */
    const detectTenantFromDomain = () => {
        const hostname = window.location.hostname

        // For localhost, use a default tenant identifier
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'localhost' // Default tenant for local development
        }

        // Extract subdomain or domain
        const parts = hostname.split('.')
        if (parts.length > 2) {
            // Subdomain-based: tenant.example.com -> tenant
            return parts[0]
        }

        // Custom domain: example.com -> example.com
        return hostname
    }

    /**
     * Fetch current tenant based on domain
     */
    const fetchCurrentTenant = async () => {
        try {
            loading.value = true
            const tenantIdentifier = detectTenantFromDomain()

            // Fetch tenant by domain/slug
            const data = await tenantService.getTenantByDomain(tenantIdentifier)
            currentTenant.value = data

            console.log('Current tenant loaded:', currentTenant.value?.name)
        } catch (error: any) {
            console.error('Failed to fetch current tenant:', error)
            toast.error('Failed to load tenant', {
                description: error.response?.data?.message || 'Please check your domain configuration',
            })
        } finally {
            loading.value = false
        }
    }

    /**
     * Fetch all tenants (admin only)
     */
    const fetchTenants = async () => {
        try {
            loading.value = true
            const data = await tenantService.getTenants()
            tenants.value = data
        } catch (error: any) {
            console.error('Failed to fetch tenants:', error)
            toast.error('Failed to load tenants', {
                description: error.response?.data?.message || 'Please try again',
            })
        } finally {
            loading.value = false
        }
    }

    /**
     * Create new tenant (admin only)
     */
    const createTenant = async (data: CreateTenantRequest) => {
        try {
            loading.value = true
            const newTenant = await tenantService.createTenant(data)
            tenants.value.push(newTenant)

            toast.success('Tenant created', {
                description: `${newTenant.name} has been created successfully`,
            })

            return newTenant
        } catch (error: any) {
            console.error('Failed to create tenant:', error)
            toast.error('Failed to create tenant', {
                description: error.response?.data?.message || 'Please try again',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Update tenant (admin only)
     */
    const updateTenant = async (uuid: string, data: UpdateTenantRequest) => {
        try {
            loading.value = true
            const updatedTenant = await tenantService.updateTenant(uuid, data)

            const index = tenants.value.findIndex(t => t.uuid === uuid)
            if (index !== -1) {
                tenants.value[index] = updatedTenant
            }

            if (currentTenant.value?.uuid === uuid) {
                currentTenant.value = updatedTenant
            }

            toast.success('Tenant updated', {
                description: 'Changes have been saved successfully',
            })

            return updatedTenant
        } catch (error: any) {
            console.error('Failed to update tenant:', error)
            toast.error('Failed to update tenant', {
                description: error.response?.data?.message || 'Please try again',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Delete tenant (admin only)
     */
    const deleteTenant = async (uuid: string) => {
        try {
            loading.value = true
            await tenantService.deleteTenant(uuid)

            tenants.value = tenants.value.filter(t => t.uuid !== uuid)

            toast.success('Tenant deleted', {
                description: 'Tenant has been removed successfully',
            })
        } catch (error: any) {
            console.error('Failed to delete tenant:', error)
            toast.error('Failed to delete tenant', {
                description: error.response?.data?.message || 'Please try again',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        tenants,
        currentTenant,
        loading,
        activeTenants,
        hasTenants,
        isAdmin,
        detectTenantFromDomain,
        fetchCurrentTenant,
        fetchTenants,
        createTenant,
        updateTenant,
        deleteTenant,
    }
})
