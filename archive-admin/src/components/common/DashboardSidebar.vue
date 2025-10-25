<script setup lang="ts">
    import { computed } from "vue"
    import type { Component } from 'vue'
    import { useRoute } from "vue-router"

    import {
        Image,
        Video,
        Music,
        Users,
        Search,
        Upload,
        Shield,
        Archive,
        FileText,
        Database,
        Settings,
        BarChart3,
        Download,
    } from "lucide-vue-next"


    import {
        Sidebar,
        SidebarMenu,
        SidebarGroup,
        SidebarContent,
        SidebarMenuItem,
        SidebarGroupLabel,
        SidebarMenuButton,
        SidebarGroupContent,
        useSidebar,
    } from "@/components/ui/sidebar"


const { state: sidebarState } = useSidebar()
const route = useRoute()


interface NavItem {
    title: string
    url: string
    icon: Component
}

const mainItems: NavItem[] = [
    { title: "Dashboard", url: "/", icon: BarChart3 },
    { title: "Archive Categories", url: "/archive/categories", icon: Archive },
    { title: "Documents", url: "/documents", icon: FileText },
    { title: "Images", url: "/images", icon: Image },
    { title: "Videos", url: "/videos", icon: Video },
    { title: "Audio", url: "/audio", icon: Music },
]

const managementItems: NavItem[] = [
    { title: "Search", url: "/search", icon: Search },
    { title: "Upload", url: "/upload", icon: Upload },
    { title: "Downloads", url: "/downloads", icon: Download },
    { title: "Users", url: "/users", icon: Users },
    { title: "Storage", url: "/storage", icon: Database },
]

const systemItems: NavItem[] = [
    { title: "Security", url: "/security", icon: Shield },
    { title: "Settings", url: "/settings", icon: Settings },
]

const currentPath = computed(() => route.path)
const isCollapsed = computed(() => sidebarState.value === "collapsed")

// A function to determine if a route is active.
const isActive = (path: string) => {
    if (path === "/") return currentPath.value === "/"
    return currentPath.value.startsWith(path)
}

// A computed property to get the class for a navigation item based on its active state.
const getNavCls = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive(path)
        ? "bg-primary text-primary-foreground shadow-sm font-medium"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }`
</script>

<template>
    <Sidebar :class="`border-r bg-gradient-sidebar ${isCollapsed ? 'w-16' : 'w-56'}`" collapsible="icon">
        <SidebarContent class="p-3">
            <!-- Logo/Brand -->
            <div class="mb-4 px-2">
                <template v-if="!isCollapsed">
                    <div class="flex items-center gap-3">
                        <div class=" rounded-lg bg-archive-primary p-2 flex items-center justify-center">
                            <Archive class="h-4 w-4 text-white" />
                        </div>
                        <div :class="isCollapsed ? 'opacity-0' : 'opacity-100'">
                            <h2 class="font-semibold text-foreground">Archive Admin</h2>
                            <p class="text-xs text-muted-foreground">Admin Portal</p>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <div class="flex justify-center">
                        <div class="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                            <Archive class="h-4 w-4 text-archive-primary" />
                        </div>
                    </div>
                </template>
            </div>

            <!-- Main Navigation -->
            <SidebarGroup>
                <SidebarGroupLabel :class="isCollapsed ? 'sr-only' : ''">
                    Archive
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu class="space-y-1">
                        <SidebarMenuItem v-for="item in mainItems" :key="item.title">
                            <SidebarMenuButton asChild>
                                <router-link :to="item.url" :class="getNavCls(item.url)">
                                    <Component :is="item.icon" class="h-4 w-4 shrink-0" />
                                    <span v-if="!isCollapsed">{{ item.title }}</span>
                                </router-link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <!-- Management -->
            <SidebarGroup >
                <SidebarGroupLabel :class="isCollapsed ? 'sr-only' : ''">
                    Management
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu class="space-y-1">
                        <SidebarMenuItem v-for="item in managementItems" :key="item.title">
                            <SidebarMenuButton asChild>
                                <router-link :to="item.url" :class="getNavCls(item.url)">
                                    <Component :is="item.icon" class="h-4 w-4 shrink-0" />
                                    <span v-if="!isCollapsed">{{ item.title }}</span>
                                </router-link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <!-- System -->
            <SidebarGroup >
                <SidebarGroupLabel :class="isCollapsed ? 'sr-only' : ''">
                    System
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu class="space-y-1">
                        <SidebarMenuItem v-for="item in systemItems" :key="item.title">
                            <SidebarMenuButton asChild>
                                <router-link :to="item.url" :class="getNavCls(item.url)">
                                    <Component :is="item.icon" class="h-4 w-4 shrink-0" />
                                    <span v-if="!isCollapsed">{{ item.title }}</span>
                                </router-link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
</template>