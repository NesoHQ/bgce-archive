<script setup lang="ts">
    import { onMounted } from "vue";
    import { useRoute } from "vue-router";
const route = useRoute();

onMounted(() => {
    console.error(
        "404 Error: User attempted to access non-existent route:",
        route.path
    );
});
</script>

<template>
    <div class="h-full flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-4">Oops! Page not found</p>
            <!-- Use router-link for internal navigation to prevent page reload -->
            <router-link to="/" class="text-blue-500 hover:text-blue-700 underline">
                Return to Home
            </router-link>
        </div>
    </div>
</template>
