<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
// Required for new functionality and better UX:
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" 
// Importing the Select components for status update in Edit form
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Archive, Edit, Trash2, CheckCircle, Clock, XCircle, MoreHorizontal, Loader2, Save } from "lucide-vue-next"
// Assumed import of your Axios instance
import axiosInstance from "@/utils/AxiosInstance" 
import axios from "axios"
// Assuming a Sonner-like toast implementation (placeholder)
import { Toaster, toast } from 'vue-sonner' // Placeholder for Sonner implementation


// --- TYPES & STATE ---

interface Category {
    id: number
    uuid: string
    slug: string
    label: string
    description: string
    created_at: string
    status: 'pending' | 'approved' | 'rejected' | 'deleted'
}

const categories = ref<Category[]>([])
const isLoading = ref(true)
const fetchError = ref<string | null>(null)

// State for the creation form
const isCreating = ref(false)
const isSubmitting = ref(false)
const newCategoryForm = ref({
    slug: '',
    label: '',
    description: '',
})
const createError = ref<string | null>(null)
// Validation state for creation form
const createValidationErrors = ref({
    label: '',
    slug: '',
    description: '',
});


// State for editing a category (PUT API)
const showEditModal = ref(false)
const isUpdating = ref(false)
const editForm = ref({
    originalSlug: '', // Used in the API PUT path
    new_slug: '', // Sent in the payload for slug change
    label: '',
    description: '',
    status: '' as Category['status'],
})
const editError = ref<string | null>(null)
// Validation state for edit form
const editValidationErrors = ref({
    label: '',
    new_slug: '',
    description: '',
});


// --- VALIDATION LOGIC ---

/**
 * Validates the Create Category form fields.
 */
const validateCreateForm = () => {
    let isValid = true;
    createValidationErrors.value = { label: '', slug: '', description: '' };

    if (!newCategoryForm.value.label) {
        createValidationErrors.value.label = 'Category Label is required.';
        isValid = false;
    }
    
    // Slug validation: required, lowercase, alphanumeric, and hyphens only
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!newCategoryForm.value.slug) {
        createValidationErrors.value.slug = 'URL Slug is required.';
        isValid = false;
    } else if (!slugRegex.test(newCategoryForm.value.slug)) {
        createValidationErrors.value.slug = 'Slug must be lowercase, alphanumeric, and use hyphens only (e.g., my-new-slug).';
        isValid = false;
    }

    if (!newCategoryForm.value.description) {
        createValidationErrors.value.description = 'Description is required.';
        isValid = false;
    } else if (newCategoryForm.value.description.length < 10) {
        createValidationErrors.value.description = 'Description must be at least 10 characters.';
        isValid = false;
    }

    return isValid;
};

/**
 * Validates the Edit Category form fields.
 */
const validateEditForm = () => {
    let isValid = true;
    editValidationErrors.value = { label: '', new_slug: '', description: '' };

    if (!editForm.value.label) {
        editValidationErrors.value.label = 'Category Label is required.';
        isValid = false;
    }
    
    // Slug validation: required, lowercase, alphanumeric, and hyphens only
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!editForm.value.new_slug) {
        editValidationErrors.value.new_slug = 'New Slug is required.';
        isValid = false;
    } else if (!slugRegex.test(editForm.value.new_slug)) {
        editValidationErrors.value.new_slug = 'Slug must be lowercase, alphanumeric, and use hyphens only.';
        isValid = false;
    }

    if (!editForm.value.description) {
        editValidationErrors.value.description = 'Description is required.';
        isValid = false;
    } else if (editForm.value.description.length < 10) {
        editValidationErrors.value.description = 'Description must be at least 10 characters.';
        isValid = false;
    }

    return isValid;
};


// --- API ACTIONS (CRUD) ---

/**
 * [GET] Fetches the list of categories.
 */
const fetchCategories = async () => {
    isLoading.value = true
    fetchError.value = null
    try {
        const params = {
            limit: 10,
            offset: 0,
            sort_by: 'created_at',
            sort_order: 'desc',
        }
        
        const response = await axiosInstance.get('/api/v1/categories', { params })
        
        if (response.data && response.data.data) {
            categories.value = response.data.data as Category[]
        } else {
            categories.value = []
        }
        
    } catch (error) {
        console.error("Failed to fetch categories:", error)
        fetchError.value = "Failed to load categories. Please check API connection."
    } finally {
        isLoading.value = false
    }
}

/**
 * [POST] Creates a new category.
 */
const handleCreateCategory = async () => {
    createError.value = null

    if (!validateCreateForm()) {
        createError.value = "Please correct the errors in the form before submitting."
        return
    }

    isSubmitting.value = true

    try {
        // API Call: POST /api/v1/categories
        await axiosInstance.post('/api/v1/categories', newCategoryForm.value)
        
        // Success: Clear form, close modal, refresh list, and notify
        const createdLabel = newCategoryForm.value.label
        newCategoryForm.value = { slug: '', label: '', description: '', }
        createValidationErrors.value = { label: '', slug: '', description: '' }; // Clear specific errors
        isCreating.value = false
        await fetchCategories()
        toast.success(`Category '${createdLabel}' created successfully.`)

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to create category (Server Error)."
        createError.value = errorMessage
        console.error("Category creation failed:", error)
        toast.error('Creation Failed', { description: errorMessage })
    } finally {
        isSubmitting.value = false
    }
}


/**
 * [EDIT SETUP] Populates the form and opens the modal.
 */
const handleEdit = (category: Category) => {
    // 1. Store the original slug (used for the PUT URL path)
    editForm.value.originalSlug = category.slug
    
    // 2. Populate form fields
    editForm.value.new_slug = category.slug
    editForm.value.label = category.label
    editForm.value.description = category.description
    editForm.value.status = category.status
    
    // 3. Reset error and show modal
    editError.value = null
    editValidationErrors.value = { label: '', new_slug: '', description: '' }; // Clear specific errors
    showEditModal.value = true
}

/**
 * [PUT] Handles updating the category details.
 * API Path: PUT /api/v1/categories/{slug}
 */
const handleUpdateCategory = async () => {
    editError.value = null

    if (!validateEditForm()) {
        editError.value = "Please correct the errors in the form before submitting."
        return
    }

    isUpdating.value = true

    // The payload needs new_slug, label, description, and status
    const payload = {
        new_slug: editForm.value.new_slug,
        label: editForm.value.label,
        description: editForm.value.description,
        status: editForm.value.status,
    }

    try {
        // API Call: PUT /api/v1/categories/{originalSlug}
        await axiosInstance.put(`/api/v1/categories/${editForm.value.originalSlug}`, payload)
        
        // Success: Close modal, refresh list, show toast
        showEditModal.value = false
        await fetchCategories()
        toast.success(`Category '${payload.label}' updated successfully!`)

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to update category (Server Error)."
        editError.value = errorMessage
        console.error("Category update failed:", error)
        toast.error('Update Failed', { description: errorMessage })
    } finally {
        isUpdating.value = false
    }
}


/**
 * [DELETE] Deletes a category using its ID (integer).
 * API Path: DELETE /api/v1/categories/{category_id}
 */
const handleDelete = async (category: Category) => {
    
    try {
        // CORRECTED: Use category.id (integer) for the DELETE endpoint
        await axiosInstance.delete(`/api/v1/categories/${category.id}`)
        
        // Remove the category from the local list on success, filtering by ID
        categories.value = categories.value.filter(c => c.id !== category.id)
        toast.info(`Category '${category.label}' deleted.`)

    } catch (error) {
        console.error("Failed to delete category:", error)
        fetchError.value = `Failed to delete ${category.label}.`
        toast.error('Deletion Failed', { description: `Could not delete ${category.label}.` })
    }
}

/**
 * [PUT] Updates the status of a category using its SLUG (used in dropdown for quick updates).
 * API Path: PUT /api/v1/categories/{slug}
 */
const handleUpdateStatus = async (category: Category, newStatus: Category['status']) => {
    try {
        // CORRECTED: Use category.slug (string) for the PUT endpoint
        await axiosInstance.put(`/api/v1/categories/${category.slug}`, {
            status: newStatus,
        })
        
        // Update the local state on success
        const index = categories.value.findIndex(c => c.uuid === category.uuid)
        if (index !== -1) {
            categories.value[index].status = newStatus
        }
        toast.success(`Status updated to ${newStatus}.`)
        
    } catch (error) {
        console.error(`Failed to update status for ${category.label}:`, error)
        fetchError.value = `Failed to update status for ${category.label}.`
        toast.error('Status Update Failed', { description: `Could not change status for ${category.label}.` })
    }
}


// --- UTILITIES & LIFECYCLE ---

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

onMounted(fetchCategories)
</script>

<template>
    <div class="relative">
        <Toaster position="bottom-right" />
        <Card class="bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl rounded-xl max-w-7xl mx-auto my-10">
            <CardHeader class="p-6 border-b">
                <CardTitle class="flex items-center justify-between">
                    <span class="flex items-center gap-3 text-2xl font-extrabold text-gray-800">
                        <Archive class="h-7 w-7 text-indigo-600" />
                        Category Management Dashboard
                    </span>
                    <Button variant="default" size="sm" @click="isCreating = !isCreating" :class="isCreating ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'">
                        {{ isCreating ? 'Cancel Creation' : 'Create New Category' }}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent class="p-6">
                
                <!-- Category Creation Form (Inline Collapse) -->
                <Card v-if="isCreating" class="mb-8 p-6 border-l-4 border-indigo-500 bg-indigo-50 shadow-inner">
                    <CardTitle class="text-xl mb-4 font-semibold text-indigo-700">Create New Category (POST API)</CardTitle>
                    <form @submit.prevent="handleCreateCategory" class="space-y-4">
                        <!-- Top-level error for general submission failure -->
                        <Alert v-if="createError" variant="destructive">
                            <XCircle class="h-4 w-4" />
                            <AlertTitle>Creation Failed</AlertTitle>
                            <AlertDescription>{{ createError }}</AlertDescription>
                        </Alert>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Label Input -->
                            <div>
                                <Label for="label" class="text-gray-600">Category Label</Label>
                                <Input id="label" v-model="newCategoryForm.label" required placeholder="e.g., Interview Q&A" :class="{'border-red-500': createValidationErrors.label}" />
                                <p v-if="createValidationErrors.label" class="text-xs text-red-500 mt-1">{{ createValidationErrors.label }}</p>
                            </div>

                            <!-- Slug Input -->
                            <div>
                                <Label for="slug" class="text-gray-600">URL Slug</Label>
                                <Input id="slug" v-model="newCategoryForm.slug" required placeholder="e.g., interview-qna" :class="{'border-red-500': createValidationErrors.slug}" />
                                <p v-if="createValidationErrors.slug" class="text-xs text-red-500 mt-1">{{ createValidationErrors.slug }}</p>
                            </div>
                            
                            <!-- Description Input -->
                            <div class="md:col-span-2">
                                <Label for="description" class="text-gray-600">Description</Label>
                                <Textarea id="description" v-model="newCategoryForm.description" required placeholder="Brief description of the category purpose. (Min 10 characters)" rows="3" :class="{'border-red-500': createValidationErrors.description}" />
                                <p v-if="createValidationErrors.description" class="text-xs text-red-500 mt-1">{{ createValidationErrors.description }}</p>
                            </div>
                        </div>

                        <Button type="submit" :disabled="isSubmitting" class="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 transition duration-150">
                            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                            {{ isSubmitting ? 'Creating...' : 'Submit Category (POST)' }}
                        </Button>
                    </form>
                </Card>


                <!-- Status and Error Messages -->
                <div v-if="isLoading" class="p-8 text-center text-indigo-600 flex flex-col justify-center items-center gap-3 bg-indigo-50 rounded-lg">
                    <Loader2 class="animate-spin h-7 w-7" />
                    <span class="text-lg font-medium">Loading categories...</span>
                </div>
                
                <Alert v-else-if="fetchError" variant="destructive" class="mb-4 shadow-lg">
                    <XCircle class="h-4 w-4" />
                    <AlertTitle>Network Error</AlertTitle>
                    <AlertDescription>{{ fetchError }}</AlertDescription>
                    <Button variant="link" class="p-0 h-auto mt-1 text-red-100 hover:text-white" @click="fetchCategories">Retry Loading</Button>
                </Alert>

                <div v-else-if="categories.length === 0" class="p-8 text-center text-gray-500 border border-dashed rounded-lg">
                    No categories found. Click "Create New Category" to add the first one.
                </div>
                
                <!-- Category Table (GET API Display) -->
                <Table v-else>
                    <TableHeader class="bg-gray-100">
                        <TableRow>
                            <TableHead class="text-gray-600 font-semibold">Label / Slug</TableHead>
                            <TableHead class="text-gray-600 font-semibold">Description</TableHead>
                            <TableHead class="text-gray-600 font-semibold">Created At</TableHead>
                            <TableHead class="text-gray-600 font-semibold">Status</TableHead>
                            <TableHead class="text-right text-gray-600 font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="category in categories" :key="category.uuid" class="hover:bg-indigo-50/50 transition-colors duration-100">
                            <TableCell class="font-medium">
                                <p class="text-gray-800">{{ category.label }}</p>
                                <p class="text-sm text-indigo-500 font-mono">/{{ category.slug }}</p>
                            </TableCell>
                            <TableCell class="text-muted-foreground max-w-xs truncate">{{ category.description }}</TableCell>
                            <TableCell class="text-muted-foreground">
                                {{ new Date(category.created_at).toLocaleDateString() }}
                            </TableCell>
                            <TableCell>
                                <Badge 
                                    :class="getStatusBadge(category.status).class"
                                    class="capitalize flex items-center gap-1 font-semibold text-xs py-1 px-2 rounded-full shadow-sm">
                                    <component :is="getStatusBadge(category.status).icon" class="h-3 w-3" />
                                    {{ getStatusBadge(category.status).text }}
                                </Badge>
                            </TableCell>
                            <TableCell class="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="ghost" size="icon" class="hover:bg-indigo-100/50">
                                            <MoreHorizontal class="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" class="shadow-xl">
                                        <DropdownMenuItem @click="handleEdit(category)">
                                            <Edit class="mr-2 h-4 w-4" />
                                            Edit Details (PUT by Slug)
                                        </DropdownMenuItem>
                                        
                                        <!-- Dynamic Status Update Options (PUT by Slug) -->
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
                                            Delete (DELETE by ID)
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <!-- Category Edit Modal/Dialog -->
        <div v-if="showEditModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="showEditModal = false">
            <Card class="w-full max-w-lg bg-white rounded-lg shadow-2xl animate-in fade-in zoom-in">
                <CardHeader class="border-b">
                    <CardTitle class="flex items-center gap-2 text-xl text-indigo-700">
                        <Edit class="h-5 w-5" />
                        Edit Category (PUT API)
                    </CardTitle>
                </CardHeader>
                <CardContent class="p-6">
                    <form @submit.prevent="handleUpdateCategory" class="space-y-4">
                        <!-- Top-level error for general submission failure -->
                        <Alert v-if="editError" variant="destructive">
                            <XCircle class="h-4 w-4" />
                            <AlertTitle>Update Failed</AlertTitle>
                            <AlertDescription>{{ editError }}</AlertDescription>
                        </Alert>
                        
                        <!-- Label and New Slug -->
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Label Input -->
                            <div>
                                <Label for="editLabel">Label</Label>
                                <Input id="editLabel" v-model="editForm.label" required :class="{'border-red-500': editValidationErrors.label}" />
                                <p v-if="editValidationErrors.label" class="text-xs text-red-500 mt-1">{{ editValidationErrors.label }}</p>
                                <p class="text-xs text-gray-500 mt-1" v-if="editForm.originalSlug !== editForm.new_slug">Original Slug: /{{ editForm.originalSlug }}</p>
                            </div>
                            
                            <!-- New Slug Input -->
                            <div>
                                <Label for="editNewSlug">New Slug</Label>
                                <Input id="editNewSlug" v-model="editForm.new_slug" required :class="{'border-red-500': editValidationErrors.new_slug}" />
                                <p v-if="editValidationErrors.new_slug" class="text-xs text-red-500 mt-1">{{ editValidationErrors.new_slug }}</p>
                            </div>
                        </div>
                        
                        <!-- Description -->
                        <div>
                            <Label for="editDescription">Description</Label>
                            <Textarea id="editDescription" v-model="editForm.description" required rows="3" :class="{'border-red-500': editValidationErrors.description}" />
                            <p v-if="editValidationErrors.description" class="text-xs text-red-500 mt-1">{{ editValidationErrors.description }}</p>
                        </div>

                        <!-- Status Select -->
                        <div>
                            <Label for="editStatus">Status</Label>
                            <Select v-model="editForm.status">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="deleted">Deleted (Soft Delete)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" @click="showEditModal = false" :disabled="isUpdating">
                                Cancel
                            </Button>
                            <Button type="submit" :disabled="isUpdating" class="bg-green-600 hover:bg-green-700 transition duration-150">
                                <Loader2 v-if="isUpdating" class="mr-2 h-4 w-4 animate-spin" />
                                <Save v-else class="mr-2 h-4 w-4" />
                                {{ isUpdating ? 'Updating...' : 'Save Changes (PUT)' }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
</template>