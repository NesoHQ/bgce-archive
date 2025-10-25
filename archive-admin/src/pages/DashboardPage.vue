<script setup lang="ts">
    import { Button } from "@/components/ui/button"
    import { Progress } from "@/components/ui/progress"
    import StatCard from "@/components/platform/dashboard/StatCard.vue"
    import StorageChart from "@/components/platform/dashboard/StorageChart.vue"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import RecentFilesTable from "@/components/platform/dashboard/RecentFilesTable.vue"
    import { Archive, FileText, Image, Video, Database, TrendingUp, Users, Clock } from "lucide-vue-next"
</script>

<template>
    <div class="space-y-2">
        <h1 class="text-3xl font-bold text-foreground">
            Archive Dashboard
        </h1>
        <p class="text-muted-foreground">
            Welcome back! Here's an overview of your archive system.
        </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Files" value="12,847" change="+5.2% from last month" change-type="positive"
            :icon="Archive" />
        <StatCard title="Storage Used" value="847 GB" change="85% of total capacity" change-type="neutral"
            :icon="Database" />
        <StatCard title="Active Users" value="247" change="+12 this week" change-type="positive" :icon="Users" />
        <StatCard title="Uploads Today" value="156" change="+23% from yesterday" change-type="positive"
            :icon="TrendingUp" />
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
            <RecentFilesTable />
        </div>

        <div class="space-y-6">
            <StorageChart />

            <Card class="bg-gradient-card border-0 shadow-md">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent class="space-y-3">
                    <Button class="w-full justify-start" variant="outline">
                        <FileText class="mr-2 h-4 w-4" />
                        Upload Documents
                    </Button>
                    <Button class="w-full justify-start" variant="outline">
                        <Image class="mr-2 h-4 w-4" />
                        Add Images
                    </Button>
                    <Button class="w-full justify-start" variant="outline">
                        <Video class="mr-2 h-4 w-4" />
                        Upload Videos
                    </Button>
                    <Button class="w-full justify-start" variant="outline">
                        <Archive class="mr-2 h-4 w-4" />
                        Create Archive
                    </Button>
                </CardContent>
            </Card>

            <Card class="bg-gradient-card border-0 shadow-md">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <div class="h-2 w-2 rounded-full bg-success animate-pulse" />
                        System Status
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Server Health</span>
                            <span class="text-success font-medium">Excellent</span>
                        </div>
                        <Progress :value="95" class="h-2" />
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Storage Health</span>
                            <span class="text-warning font-medium">Good</span>
                        </div>
                        <Progress :value="85" class="h-2" />
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Network</span>
                            <span class="text-success font-medium">Optimal</span>
                        </div>
                        <Progress :value="98" class="h-2" />
                    </div>

                    <div class="pt-2 border-t">
                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock class="h-4 w-4" />
                            Last backup: 2 hours ago
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
