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
     * Fetch current tenant from localStorage or default to localhost
     */
    const fetchCurrentTenant = async () => {
        try {
            loading.value = true

            // Check if user has a saved tenant selection
            const savedTenantId = localStorage.getItem('selected-tenant-id')

            if (savedTenantId) {
                // Load the saved tenant
                const tenant = await tenantService.getTenantById(savedTenantId)
                currentTenant.value = tenant
                console.log('Loaded saved tenant:', tenant.name)
            } else {
                // Default to localhost tenant
                const tenant = await tenantService.getTenantByDomain('localhost')
                currentTenant.value = tenant
                localStorage.setItem('selected-tenant-id', tenant.uuid)
                console.log('Loaded default localhost tenant:', tenant.name)
            }
        } catch (error: any) {
            console.error('Failed to fetch current tenant:', error)
            toast.error('Failed to load tenant', {
                description: 'Please select a tenant to continue',
            })
        } finally {
            loading.value = false
        }
    }

    /**
     * Switch to a different tenant
     */
    const switchTenant = async (tenantId: string) => {
        try {
            loading.value = true
            const tenant = await tenantService.getTenantById(tenantId)

            currentTenant.value = tenant
            localStorage.setItem('selected-tenant-id', tenantId)

            toast.success('Tenant switched', {
                description: `Now managing ${tenant.name}`,
            })

            // Reload page to refresh all data for new tenant
            window.location.reload()
        } catch (error: any) {
            console.error('Failed to switch tenant:', error)
            toast.error('Failed to switch tenant', {
                description: error.response?.data?.message || 'Please try again',
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

            // If deleted tenant was current, switch to first available
            if (currentTenant.value?.uuid === uuid) {
                if (tenants.value.length > 0) {
                    await switchTenant(tenants.value[0].uuid)
                } else {
                    currentTenant.value = null
                    localStorage.removeItem('selected-tenant-id')
                }
            }

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
        fetchCurrentTenant,
        switchTenant,
        fetchTenants,
        createTenant,
        updateTenant,
        deleteTenant,
    }
})
