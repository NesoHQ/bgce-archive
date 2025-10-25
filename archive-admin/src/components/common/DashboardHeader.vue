<script setup lang="ts">
    import { useAuthStore } from "@/stores/auth"
    import { Badge } from "@/components/ui/badge"
    import { Input } from "@/components/ui/input"
    import { Button } from "@/components/ui/button"
    import { SidebarTrigger } from "@/components/ui/sidebar"
    import { Search, Bell, User, Settings, LogOut, } from "lucide-vue-next"

    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu"

const {handleLogout} = useAuthStore()

</script>

<template>
    <header class="p-4 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div class="flex items-center gap-4">
            <SidebarTrigger class="cursor-pointer" />

            <!-- Search -->
            <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search archives..." class="w-64 pl-10 bg-background/50" />
            </div>
        </div>

        <div class="flex items-center gap-4">
            <!-- Notifications -->
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="relative cursor-pointer">
                        <Bell class="h-4 w-4" />
                        <Badge
                            class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                            3
                        </Badge>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="cursor-pointer">
                        <div class="flex flex-col gap-1">
                            <p class="text-sm font-medium">New upload completed</p>
                            <p class="text-xs text-muted-foreground">document.pdf was successfully archived</p>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem class="cursor-pointer">
                        <div class="flex flex-col gap-1">
                            <p class="text-sm font-medium">Storage warning</p>
                            <p class="text-xs text-muted-foreground">Archive storage is 85% full</p>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem class="cursor-pointer">
                        <div class="flex flex-col gap-1">
                            <p class="text-sm font-medium">Backup completed</p>
                            <p class="text-xs text-muted-foreground">Weekly backup finished successfully</p>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- User Menu -->
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="ghost" class="flex items-center gap-2 cursor-pointer">
                        <div class="h-8 w-8 rounded-full bg-archive-primary flex items-center justify-center">
                            <User class="h-4 w-4 text-white" />
                        </div>
                        <div class="hidden sm:block text-left">
                            <p class="text-sm font-medium">Admin User</p>
                            <p class="text-xs text-muted-foreground">admin@archive.com</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="cursor-pointer">
                        <User class="mr-2 h-4 w-4" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem class="cursor-pointer">
                        <Settings class="mr-2 h-4 w-4" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="cursor-pointer" @click="handleLogout">
                        <LogOut class="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
</template>
