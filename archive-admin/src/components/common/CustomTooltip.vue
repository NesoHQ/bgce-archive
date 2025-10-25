<script setup lang="ts">
    import { computed } from 'vue'

interface TooltipPayload {
    name: string
    value: number
}

const props = defineProps<{
    active?: boolean
    payload?: { payload: TooltipPayload }[]
}>()

// Use a computed property to check if the tooltip should be visible.
const isVisible = computed(() => {
    return props.active && props.payload && props.payload.length
})

const tooltipData = computed(() => {
    if (isVisible.value) {
        return props.payload![0].payload
    }
    return null
})
</script>

<template>
    <div v-if="isVisible" class="p-2 border rounded-lg bg-card border-border shadow-md">
        <p class="font-bold text-foreground">{{ tooltipData?.name }}</p>
        <p class="text-sm text-muted-foreground">{{ tooltipData?.value }}%</p>
    </div>
</template>