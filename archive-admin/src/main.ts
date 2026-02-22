import './assets/styles/main.css'

import App from './App.vue'
import router from '@/router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import { useTenantStore } from './stores/tenant'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
const tenantStore = useTenantStore()

authStore.initializeAuth()

// Initialize tenant data
const initializeTenants = async () => {
    // Fetch current tenant first
    await tenantStore.fetchCurrentTenant()
    // Then fetch all tenants for the switcher
    await tenantStore.fetchTenants()
}

initializeTenants()

app.mount('#app')
