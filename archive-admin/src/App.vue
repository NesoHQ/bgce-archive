<script setup lang="ts">
import 'vue-sonner/style.css'
import { RouterView } from 'vue-router';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
</script>

<template>
    <TooltipProvider>
        <Toaster position="top-right" :rich-colors="true" class="z-[9999]" :theme="'light'" />
        <RouterView />
    </TooltipProvider>
</template>