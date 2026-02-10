<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X, Upload, AlertCircle, FileText, CheckCircle2 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', file: File): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const dragOver = ref(false)
const validationErrors = ref<string[]>([])
const isValidating = ref(false)

const isValidFile = computed(() => {
  return selectedFile.value && validationErrors.value.length === 0
})

const handleClose = () => {
  emit('update:open', false)
  resetForm()
}

const resetForm = () => {
  selectedFile.value = null
  validationErrors.value = []
  isValidating.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const validateCSVFile = (file: File): string[] => {
  const errors: string[] = []

  // Check file type
  if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
    errors.push('File must be a CSV file (.csv)')
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB')
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push('File cannot be empty')
  }

  return errors
}

const validateCSVContent = async (file: File): Promise<string[]> => {
  return new Promise((resolve) => {
    const errors: string[] = []
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        if (!text || text.trim().length === 0) {
          errors.push('File is empty')
          resolve(errors)
          return
        }

        // Parse CSV into rows (handling multi-line quoted fields)
        const parseCSVIntoRows = (csvText: string): string[] => {
          const rows: string[] = []
          let currentRow = ''
          let inQuotes = false
          
          for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i]
            const nextChar = csvText[i + 1]
            
            if (char === '"' && inQuotes && nextChar === '"') {
              // Escaped quote
              currentRow += '""'
              i++
            } else if (char === '"') {
              // Toggle quote state
              inQuotes = !inQuotes
              currentRow += char
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
              // Row separator (only when not in quotes)
              if (currentRow.trim()) {
                rows.push(currentRow.trim())
              }
              currentRow = ''
              // Skip \r\n combination
              if (char === '\r' && nextChar === '\n') {
                i++
              }
            } else {
              currentRow += char
            }
          }
          
          // Add last row if exists
          if (currentRow.trim()) {
            rows.push(currentRow.trim())
          }
          
          return rows
        }

        const lines = parseCSVIntoRows(text)
        
        if (lines.length < 2) {
          errors.push('CSV must contain at least a header row and one data row')
          resolve(errors)
          return
        }

        // Validate header
        const headerLine = lines[0]
        const headerLower = headerLine.toLowerCase()
        const requiredColumns = [
          'title',
          'slug',
          'content',
          'summary',
          'thumbnail',
          'category_id',
          'sub_category_id',
          'meta_title',
          'meta_description',
          'keywords',
          'og_image',
          'is_public',
          'is_featured',
          'is_pinned'
        ]
        
        const missingColumns = requiredColumns.filter(col => !headerLower.includes(col))
        if (missingColumns.length > 0) {
          errors.push(`Missing required columns: ${missingColumns.join(', ')}`)
          resolve(errors)
          return
        }

        // Get column indices
        const headers = headerLine.split(',').map(h => h.trim().toLowerCase())
        const columnMap: Record<string, number> = {}
        requiredColumns.forEach(col => {
          const index = headers.indexOf(col)
          if (index !== -1) columnMap[col] = index
        })

        // Check for reasonable row count
        // const dataRows = lines.length - 1
        // if (dataRows > 10000) {
        //   errors.push('Maximum 10,000 posts allowed per upload')
        //   resolve(errors)
        //   return
        // }

        // Helper function to parse CSV row (handles quoted values)
        const parseCSVRow = (row: string): string[] => {
          const result: string[] = []
          let current = ''
          let inQuotes = false
          
          for (let i = 0; i < row.length; i++) {
            const char = row[i]
            const nextChar = row[i + 1]
            
            if (char === '"' && inQuotes && nextChar === '"') {
              // Escaped quote inside quoted field
              current += '"'
              i++
            } else if (char === '"') {
              // Toggle quote state
              inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
              // Field separator (only when not in quotes)
              result.push(current.trim())
              current = ''
            } else {
              current += char
            }
          }
          result.push(current.trim())
          return result
        }

        // Validate each data row
        const maxErrorsToShow = 10
        let errorCount = 0
        
        for (let i = 1; i < lines.length && errorCount < maxErrorsToShow; i++) {
          const rowNum = i + 1 // User-facing row number (1-based, accounting for header)
          const row = lines[i]
          const columns = parseCSVRow(row)
          
          
          // Check column count
          if (columns.length !== headers.length) {
            errors.push(`Row ${rowNum}: Expected ${headers.length} columns but found ${columns.length}`)
            errorCount++
            continue
          }

          // Validate required fields are not empty
          const emptyFields: string[] = []
          requiredColumns.forEach(col => {
            const index = columnMap[col]
            if (index !== undefined) {
              const value = columns[index]?.trim()
              if (!value || value === '') {
                emptyFields.push(col)
              }
            }
          })

          if (emptyFields.length > 0) {
            errors.push(`Row ${rowNum}: Empty required field(s) - ${emptyFields.join(', ')}`)
            errorCount++
            continue
          }

          // Validate numeric fields
          const categoryId = columns[columnMap['category_id']]?.trim()
          if (categoryId && isNaN(Number(categoryId))) {
            errors.push(`Row ${rowNum}: category_id must be a number (found: "${categoryId}")`)
            errorCount++
            continue
          }

          const subCategoryId = columns[columnMap['sub_category_id']]?.trim()
          if (subCategoryId && isNaN(Number(subCategoryId))) {
            errors.push(`Row ${rowNum}: sub_category_id must be a number (found: "${subCategoryId}")`)
            errorCount++
            continue
          }

          // Validate boolean fields
          const booleanFields = ['is_public', 'is_featured', 'is_pinned']
          for (const field of booleanFields) {
            const value = columns[columnMap[field]]?.trim().toLowerCase()
            if (value && !['true', 'false', '1', '0'].includes(value)) {
              errors.push(`Row ${rowNum}: ${field} must be true/false or 1/0 (found: "${value}")`)
              errorCount++
              break
            }
          }

          // Validate URL fields
          const urlFields = ['thumbnail', 'og_image']
          for (const field of urlFields) {
            const value = columns[columnMap[field]]?.trim()
            if (value) {
              try {
                new URL(value)
              } catch {
                errors.push(`Row ${rowNum}: ${field} must be a valid URL (found: "${value.substring(0, 50)}...")`)
                errorCount++
                break
              }
            }
          }
        }

        if (errorCount >= maxErrorsToShow && lines.length - 1 > maxErrorsToShow) {
          errors.push(`... and possibly more errors in remaining rows`)
        }

        resolve(errors)
      } catch (error) {
        errors.push('Failed to parse CSV file')
        resolve(errors)
      }
    }

    reader.onerror = () => {
      errors.push('Failed to read file')
      resolve(errors)
    }

    reader.readAsText(file)
  })
}

const handleFileSelect = async (file: File) => {
  isValidating.value = true
  validationErrors.value = []

  // Basic validation
  const basicErrors = validateCSVFile(file)
  if (basicErrors.length > 0) {
    validationErrors.value = basicErrors
    selectedFile.value = null
    isValidating.value = false
    toast.error('Invalid File', basicErrors[0])
    return
  }

  // Content validation
  const contentErrors = await validateCSVContent(file)
  if (contentErrors.length > 0) {
    validationErrors.value = contentErrors
    selectedFile.value = null
    isValidating.value = false
    toast.error('Invalid CSV', contentErrors[0])
    return
  }

  selectedFile.value = file
  isValidating.value = false
  toast.success('Valid File', 'CSV file is ready for upload')
}

const handleFileInputChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await handleFileSelect(file)
  }
}

const handleDrop = async (event: DragEvent) => {
  dragOver.value = false
  event.preventDefault()
  
  const file = event.dataTransfer?.files[0]
  if (file) {
    await handleFileSelect(file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleSubmit = () => {
  if (!selectedFile.value || validationErrors.value.length > 0) {
    toast.error('Invalid File', 'Please select a valid CSV file')
    return
  }

  emit('submit', selectedFile.value)
  // handleClose()
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
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
        <div class="relative bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-semibold">Batch Upload Posts</h2>
              <p class="text-sm text-muted-foreground mt-1">
                Upload a CSV file containing multiple posts
              </p>
            </div>
            <Button variant="ghost" size="icon" @click="handleClose">
              <X class="h-4 w-4" />
            </Button>
          </div>

          <!-- Instructions -->
          <div class="mb-6 p-4 rounded-lg border bg-muted/50">
            <h3 class="font-medium mb-2 flex items-center gap-2">
              <FileText class="h-4 w-4" />
              CSV Format Requirements
            </h3>
            <ul class="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li><strong>Required columns:</strong> title, slug, content, summary, thumbnail, category_id, sub_category_id, meta_title, meta_description, keywords, og_image, is_public, is_featured, is_pinned</li>
              <li><strong>Boolean values:</strong> is_public, is_featured, is_pinned (use: true/false)</li>
              
            </ul>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- File Upload Area -->
            <div class="space-y-2">
              <Label>CSV File</Label>
              <div
                class="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
                :class="{
                  'border-primary bg-primary/5': dragOver,
                  'border-muted-foreground/25 hover:border-primary/50': !dragOver && !selectedFile,
                  'border-green-500 bg-green-500/5': selectedFile && !validationErrors.length,
                  'border-red-500 bg-red-500/5': validationErrors.length > 0
                }"
                @drop="handleDrop"
                @dragover="handleDragOver"
                @dragleave="handleDragLeave"
                @click="triggerFileInput"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept=".csv,text/csv"
                  class="hidden"
                  @change="handleFileInputChange"
                />

                <div v-if="isValidating" class="flex flex-col items-center gap-3">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p class="text-sm text-muted-foreground">Validating file...</p>
                </div>

                <div v-else-if="!selectedFile" class="flex flex-col items-center gap-3">
                  <Upload class="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p class="text-sm font-medium">Drop your CSV file here, or click to browse</p>
                    <p class="text-xs text-muted-foreground mt-1">Supports .csv files up to 10MB</p>
                  </div>
                </div>

                <div v-else-if="selectedFile && validationErrors.length === 0" class="flex flex-col items-center gap-3">
                  <CheckCircle2 class="h-12 w-12 text-green-500" />
                  <div>
                    <p class="text-sm font-medium">{{ selectedFile.name }}</p>
                    <p class="text-xs text-muted-foreground mt-1">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" @click.stop="resetForm">
                    Choose Different File
                  </Button>
                </div>

                <div v-else class="flex flex-col items-center gap-3">
                  <AlertCircle class="h-12 w-12 text-red-500" />
                  <div>
                    <p class="text-sm font-medium text-red-500">Invalid file</p>
                    <p class="text-xs text-muted-foreground mt-1">Please select a valid CSV file</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Validation Errors -->
            <div v-if="validationErrors.length > 0" class="rounded-lg border border-red-500 bg-red-500/5 p-4">
              <div class="flex items-start gap-3">
                <AlertCircle class="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div class="flex-1 space-y-1">
                  <p class="text-sm font-medium text-red-500">Validation Errors</p>
                  <ul class="text-sm text-red-700 space-y-1 list-disc ml-4">
                    <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" @click="handleClose">
                Cancel
              </Button>
              <Button 
                type="submit" 
                :disabled="!isValidFile || isValidating"
                class="gap-2"
              >
                <Upload class="h-4 w-4" />
                Upload Posts
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
