<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive, Edit, Trash2, CheckCircle, Clock, XCircle, MoreHorizontal, Plus } from "lucide-vue-next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCategoryStore } from "@/stores/category"
import CategoryModal from "@/components/platform/CategoryModal.vue"
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/api"

const categoryStore = useCategoryStore()

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const selectedCategory = ref<Category | null>(null)

const handleCreate = () => {
    modalMode.value = 'create'
    selectedCategory.value = null
    isModalOpen.value = true
}

const handleEdit = (category: Category) => {
    modalMode.value = 'edit'
    selectedCategory.value = category
    isModalOpen.value = true
}

const handleModalSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (modalMode.value === 'create') {
        await categoryStore.createCategory(data as CreateCategoryRequest)
    } else if (selectedCategory.value) {
        await categoryStore.updateCategory(selectedCategory.value.slug, data as UpdateCategoryRequest)
    }
}

const handleDelete = async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.label}"?`)) {
        await categoryStore.deleteCategory(category.uuid)
    }
}

const handleUpdateStatus = async (category: Category, newStatus: Category['status']) => {
    try {
        await categoryStore.updateCategory(category.slug, { status: newStatus } as any)
    } catch (error) {
        console.error(`Failed to update status for ${category.label}:`, error)
    }
}

const getStatusBadge = (status: Category['status']) => {
    switch (status) {
        case 'approved':
            return { icon: CheckCircle, text: 'Approved', class: 'bg-green-500 hover:bg-green-600 text-white' }
        case 'pending':
            return { icon: Clock, text: 'Pending', class: 'bg-yellow-500 hover:bg-yellow-600 text-black' }
        case 'rejected':
            return { icon: XCircle, text: 'Rejected', class: 'bg-red-500 hover:bg-red-600 text-white' }
        case 'deleted':
            return { icon: Trash2, text: 'Deleted', class: 'bg-gray-500 hover:bg-gray-600 text-white' }
        default:
             return { icon: Clock, text: status, class: 'bg-gray-200 text-gray-700' }
    }
}

onMounted(() => {
    categoryStore.fetchCategories()
})
</script>

<template>
    <Card class="bg-gradient-card border-0 shadow-md">
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                    <Archive class="h-5 w-5 text-primary" />
                    Category Management
                </span>
                <Button variant="default" size="sm" @click="handleCreate">
                    <Plus class="h-4 w-4 mr-2" />
                    Create New Category
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div v-if="categoryStore.loading" class="p-8 text-center text-muted-foreground flex justify-center items-center gap-2">
                <Clock class="animate-spin h-5 w-5" />
                <span>Loading categories...</span>
            </div>
            
            <div v-else-if="categoryStore.error" class="p-8 text-center text-red-500 bg-red-50 border border-red-200 rounded-lg">
                Error: {{ categoryStore.error }}
                <Button variant="link" class="mt-2" @click="categoryStore.fetchCategories()">Retry</Button>
            </div>

            <div v-else-if="categoryStore.categories.length === 0" class="p-8 text-center text-muted-foreground">
                No categories found. Click "Create New Category" to add one.
            </div>
            
            <Table v-else>
                <TableHeader>
                    <TableRow>
                        <TableHead>Label / Slug</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead class="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="category in categoryStore.categories" :key="category.uuid" class="hover:bg-muted/50">
                        <TableCell class="font-medium">
                            <p class="text-foreground">{{ category.label }}</p>
                            <p class="text-sm text-muted-foreground">/{{ category.slug }}</p>
                        </TableCell>
                        <TableCell class="text-muted-foreground max-w-xs truncate">{{ category.description }}</TableCell>
                        <TableCell class="text-muted-foreground">
                            {{ new Date(category.created_at).toLocaleDateString() }}
                        </TableCell>
                        <TableCell>
                            <Badge 
                                :class="getStatusBadge(category.status).class"
                                class="capitalize flex items-center gap-1 w-fit">
                                <component :is="getStatusBadge(category.status).icon" class="h-3 w-3" />
                                {{ getStatusBadge(category.status).text }}
                            </Badge>
                        </TableCell>
                        <TableCell class="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal class="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem @click="handleEdit(category)">
                                        <Edit class="mr-2 h-4 w-4" />
                                        Edit Details
                                    </DropdownMenuItem>
                                    
                                    <template v-if="category.status !== 'approved'">
                                        <DropdownMenuItem @click="handleUpdateStatus(category, 'approved')">
                                            <CheckCircle class="mr-2 h-4 w-4 text-green-600" />
                                            Approve
                                        </DropdownMenuItem>
                                    </template>
                                    <template v-if="category.status !== 'rejected'">
                                        <DropdownMenuItem @click="handleUpdateStatus(category, 'rejected')">
                                            <XCircle class="mr-2 h-4 w-4 text-red-600" />
                                            Reject
                                        </DropdownMenuItem>
                                    </template>

                                    <DropdownMenuItem @click="handleDelete(category)" class="text-red-600 focus:text-red-700">
                                        <Trash2 class="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>

    <!-- Category Modal -->
    <CategoryModal
        v-model:open="isModalOpen"
        :mode="modalMode"
        :category="selectedCategory"
        @submit="handleModalSubmit"
    />
</template>
