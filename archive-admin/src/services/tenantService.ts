import api from './api'
import type { Tenant, CreateTenantRequest, UpdateTenantRequest } from '@/types/tenant'

interface ApiResponse<T> {
    status: boolean
    message: string
    data: T
}

export const tenantService = {
    /**
     * Get current tenant by domain/slug
     */
    async getTenantByDomain(identifier: string) {
        const response = await api.get<ApiResponse<Tenant>>(`/tenants/by-domain/${identifier}`)
        return response.data.data
    },

    /**
     * Get all tenants (admin only)
     */
    async getTenants() {
        const response = await api.get<ApiResponse<Tenant[]>>('/tenants')
        return response.data.data
    },

    /**
     * Get tenant by ID
     */
    async getTenantById(id: string) {
        const response = await api.get<ApiResponse<Tenant>>(`/tenants/${id}`)
        return response.data.data
    },

    /**
     * Create new tenant (admin only)
     */
    async createTenant(data: CreateTenantRequest) {
        const response = await api.post<ApiResponse<Tenant>>('/tenants', data)
        return response.data.data
    },

    /**
     * Update tenant (admin only)
     */
    async updateTenant(id: string, data: UpdateTenantRequest) {
        const response = await api.put<ApiResponse<Tenant>>(`/tenants/${id}`, data)
        return response.data.data
    },

    /**
     * Delete tenant (admin only)
     */
    async deleteTenant(id: string) {
        const response = await api.delete<ApiResponse<null>>(`/tenants/${id}`)
        return response.data
    },

    /**
     * Get tenant stats
     */
    async getTenantStats(tenantId: string) {
        const response = await api.get<ApiResponse<any>>(`/tenants/${tenantId}/stats`)
        return response.data.data
    },
}
