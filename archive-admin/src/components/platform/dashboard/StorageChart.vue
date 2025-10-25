<script setup lang="ts">
    import { Pie } from 'vue-chartjs'
    import { ref, computed } from "vue"
    import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Register the required components for Chart.js.
ChartJS.register(Title, Tooltip, Legend, ArcElement)

// Define the raw data for the chart.
const storageData = ref([
    { name: "Documents", value: 35, color: "#3b82f6" },
    { name: "Images", value: 28, color: "#10b981" },
    { name: "Videos", value: 25, color: "#8b5cf6" },
    { name: "Audio", value: 8, color: "#f59e0b" },
    { name: "Other", value: 4, color: "#6b7280" },
])

// A computed property to calculate the total storage.
const totalStorage = computed(() => {
    return storageData.value.reduce((sum, item) => sum + item.value, 0)
})

// The data object for the chart, structured for Vue Chart.js.
const chartData = computed(() => ({
    labels: storageData.value.map(item => item.name),
    datasets: [{
        data: storageData.value.map(item => item.value),
        backgroundColor: storageData.value.map(item => item.color),
    }]
}))

// The options object for the chart.
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom'
        },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    return `${label}: ${value}%`;
                }
            }
        }
    }
}
</script>

<template>
    <Card class="bg-gradient-card border-0 shadow-md">
        <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <p class="text-sm text-muted-foreground">
                {{ totalStorage }}% of 1TB used
            </p>
        </CardHeader>
        <CardContent>
            <div class="h-64">
                <!-- The Vue Chart.js pie component -->
                <Pie :data="chartData" :options="chartOptions" />
            </div>

            <div class="mt-4 space-y-2">
                <div v-for="item in storageData" :key="item.name" class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }" />
                        <span class="text-muted-foreground">{{ item.name }}</span>
                    </div>
                    <span class="font-medium">{{ item.value }}%</span>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
