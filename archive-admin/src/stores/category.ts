import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { categoryService } from '@/services'
import type { Category, CreateCategoryRequest, UpdateCategoryRequest, CategoryFilter } from '@/types/api'

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([])
    const currentCategory = ref<Category | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Fetch all categories
     */
    const fetchCategories = async (filter?: CategoryFilter) => {
        try {
            loading.value = true
            error.value = null
            const response = await categoryService.getCategories(filter)

            if (response.status && response.data) {
                categories.value = response.data
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch categories'
            console.error('Fetch categories error:', err)
        } finally {
            loading.value = false
        }
    }

    /**
     * Fetch category by UUID
     */
    const fetchCategoryByUUID = async (uuid: string) => {
        try {
            loading.value = true
            error.value = null
            const response = await categoryService.getCategoryByUUID(uuid)

            if (response.status && response.data) {
                currentCategory.value = response.data
                return response.data
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch category'
            console.error('Fetch category error:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Create new category
     */
    const createCategory = async (data: CreateCategoryRequest) => {
        try {
            loading.value = true
            error.value = null
            const response = await categoryService.createCategory(data)

            if (response.status) {
                toast.success('Category Created', {
                    description: 'The category has been created successfully',
                })

                // Refresh categories list
                await fetchCategories()
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to create category'
            console.error('Create category error:', err)
            toast.error('Creation Failed', {
                description: err.response?.data?.message || 'Failed to create category',
            })
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Update category
     */
    const updateCategory = async (slug: string, data: UpdateCategoryRequest) => {
        try {
            loading.value = true
            error.value = null
            const response = await categoryService.updateCategory(slug, data)

            if (response.status) {
                toast.success('Category Updated', {
                    description: 'The category has been updated successfully',
                })

                // Refresh categories list
                await fetchCategories()
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to update category'
            console.error('Update category error:', err)
            toast.error('Update Failed', {
                description: err.response?.data?.message || 'Failed to update category',
            })
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Delete category
     */
    const deleteCategory = async (uuid: string) => {
        try {
            loading.value = true
            error.value = null
            const response = await categoryService.deleteCategory(uuid)

            if (response.status) {
                toast.success('Category Deleted', {
                    description: 'The category has been deleted successfully',
                })

                // Remove from local state
                categories.value = categories.value.filter((cat) => cat.uuid !== uuid)
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to delete category'
            console.error('Delete category error:', err)
            toast.error('Deletion Failed', {
                description: err.response?.data?.message || 'Failed to delete category',
            })
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        categories,
        currentCategory,
        loading,
        error,
        fetchCategories,
        fetchCategoryByUUID,
        createCategory,
        updateCategory,
        deleteCategory,
    }
})
