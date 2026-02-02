<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-vue-next'
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'

interface Props {
  open: boolean
  category?: Category | null
  mode: 'create' | 'edit'
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: CreateCategoryRequest | UpdateCategoryRequest): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref({
  slug: '',
  label: '',
  description: '',
})

// Reset form when modal opens/closes or category changes
watch(() => [props.open, props.category], () => {
  if (props.open && props.category && props.mode === 'edit') {
    formData.value = {
      slug: props.category.slug,
      label: props.category.label,
      description: props.category.description || '',
    }
  } else if (props.open && props.mode === 'create') {
    formData.value = {
      slug: '',
      label: '',
      description: '',
    }
  }
}, { immediate: true })

const handleClose = () => {
  emit('update:open', false)
}

const handleSubmit = () => {
  if (props.mode === 'create') {
    emit('submit', formData.value as CreateCategoryRequest)
  } else {
    // For edit, only send changed fields
    const updateData: UpdateCategoryRequest = {
      label: formData.value.label,
      description: formData.value.description,
    }
    emit('submit', updateData)
  }
  handleClose()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        ></div>
        
        <!-- Modal -->
        <div class="relative bg-background rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">
              {{ mode === 'create' ? 'Create New Category' : 'Edit Category' }}
            </h2>
            <Button variant="ghost" size="icon" @click="handleClose">
              <X class="h-4 w-4" />
            </Button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="slug">Slug</Label>
              <Input
                id="slug"
                v-model="formData.slug"
                placeholder="category-slug"
                :disabled="mode === 'edit'"
                required
              />
              <p v-if="mode === 'edit'" class="text-xs text-muted-foreground">
                Slug cannot be changed after creation
              </p>
            </div>

            <div class="space-y-2">
              <Label for="label">Label</Label>
              <Input
                id="label"
                v-model="formData.label"
                placeholder="Category Name"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="description">Description</Label>
              <textarea
                id="description"
                v-model="formData.description"
                placeholder="Category description..."
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" @click="handleClose">
                Cancel
              </Button>
              <Button type="submit">
                {{ mode === 'create' ? 'Create' : 'Update' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
