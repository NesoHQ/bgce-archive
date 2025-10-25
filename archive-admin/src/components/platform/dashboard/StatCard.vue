<script setup lang="ts">
    import { computed } from "vue"
    import type { Component } from "vue"
    import { Card, CardContent } from "@/components/ui/card"

const props = defineProps<{
    title: string
    value: string
    change?: string
    changeType?: "positive" | "negative" | "neutral"
    icon: Component
}>()

// A computed property to get the correct Tailwind color class based on the changeType prop.
const getChangeColor = computed(() => {
    switch (props.changeType) {
        case "positive":
            return "text-success"
        case "negative":
            return "text-destructive"
        default:
            return "text-muted-foreground"
    }
})
</script>

<template>
    <Card class="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent class="p-6">
            <div class="flex items-center justify-between">
                <div class="space-y-2">
                    <p class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {{ title }}
                    </p>
                    <p class="text-3xl font-bold text-foreground">
                        {{ value }}
                    </p>
                    <!-- Conditional rendering with v-if -->
                    <p v-if="change" :class="`text-sm font-medium ${getChangeColor}`">
                        {{ change }}
                    </p>
                </div>
                <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <!-- Dynamically render the icon component -->
                    <component :is="icon" class="h-6 w-6 text-primary" />
                </div>
            </div>
        </CardContent>
    </Card>
</template>
