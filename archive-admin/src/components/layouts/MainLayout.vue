<script setup lang="ts">
    import { RouterView } from 'vue-router';
    import DashboardHeader from '@/components/common/DashboardHeader.vue';
    import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
    import DashboardSidebar from '@/components/common/DashboardSidebar.vue';
</script>

<template>
    <SidebarProvider>
        <div class="min-h-screen flex w-full bg-background">
            <DashboardSidebar />

            <SidebarInset class="flex-1">
                <DashboardHeader />
                <main class="flex-1 p-6 space-y-6">
                    <RouterView />
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
</template>