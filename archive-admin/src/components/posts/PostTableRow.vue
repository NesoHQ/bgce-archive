<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, Eye, Archive, FileText } from 'lucide-vue-next'
import type { Post } from '@/types/api'

interface Props {
  post: Post
  selected?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [id: number]
  delete: [id: number]
  publish: [id: number]
  unpublish: [id: number]
  archive: [id: number]
  preview: [id: number]
  toggleSelect: []
}>()

const getStatusBadge = (status: string) => {
  const badges = {
    draft: { class: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Draft', icon: FileText },
    published: { class: 'bg-green-100 text-green-700 border-green-200', text: 'Published', icon: CheckCircle },
    archived: { class: 'bg-orange-100 text-orange-700 border-orange-200', text: 'Archived', icon: Archive },
    deleted: { class: 'bg-red-100 text-red-700 border-red-200', text: 'Deleted', icon: XCircle },
    pending: { class: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Pending', icon: FileText },
  }
  return badges[status as keyof typeof badges] || badges.draft
}
</script>

<template>
  <TableRow class="hover:bg-muted/30 transition-colors">
    <TableCell class="w-12">
      <Checkbox 
        :checked="selected"
        @update:checked="emit('toggleSelect')"
      />
    </TableCell>
    <TableCell>
      <div class="flex items-start gap-2">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <p class="font-semibold text-sm">{{ post.title }}</p>
            <Badge v-if="post.is_pinned" variant="outline" class="text-xs">Pinned</Badge>
            <Badge v-if="post.is_featured" variant="outline" class="text-xs">Featured</Badge>
          </div>
          <p class="text-xs text-muted-foreground mt-1">/{{ post.slug }}</p>
        </div>
      </div>
    </TableCell>
    <TableCell>
      <Badge variant="outline" class="font-normal">
        Category {{ post.category_id }}
      </Badge>
    </TableCell>
    <TableCell>
      <Badge :class="getStatusBadge(post.status).class" class="border font-medium gap-1">
        <component :is="getStatusBadge(post.status).icon" class="h-3 w-3" />
        {{ getStatusBadge(post.status).text }}
      </Badge>
    </TableCell>
    <TableCell class="text-sm text-muted-foreground">
      {{ new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
    </TableCell>
    <TableCell class="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="h-8 w-8">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuItem @click="emit('edit', post.id)" class="gap-2">
            <Edit class="h-4 w-4" />
            Edit Post
          </DropdownMenuItem>
          <DropdownMenuItem @click="emit('preview', post.id)" class="gap-2">
            <Eye class="h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          <!-- Draft actions -->
          <DropdownMenuItem 
            v-if="post.status === 'draft'" 
            @click="emit('publish', post.id)"
            class="gap-2 text-green-600"
          >
            <CheckCircle class="h-4 w-4" />
            Publish
          </DropdownMenuItem>
          
          <!-- Published actions -->
          <DropdownMenuItem 
            v-if="post.status === 'published'" 
            @click="emit('unpublish', post.id)"
            class="gap-2 text-orange-600"
          >
            <XCircle class="h-4 w-4" />
            Unpublish
          </DropdownMenuItem>
          <DropdownMenuItem 
            v-if="post.status === 'published'" 
            @click="emit('archive', post.id)"
            class="gap-2 text-blue-600"
          >
            <Archive class="h-4 w-4" />
            Archive
          </DropdownMenuItem>
          
          <!-- Archived actions -->
          <DropdownMenuItem 
            v-if="post.status === 'archived'" 
            @click="emit('publish', post.id)"
            class="gap-2 text-green-600"
          >
            <CheckCircle class="h-4 w-4" />
            Restore & Publish
          </DropdownMenuItem>
          
          <DropdownMenuSeparator v-if="post.status !== 'deleted'" />
          <DropdownMenuItem 
            v-if="post.status !== 'deleted'"
            @click="emit('delete', post.id)" 
            class="gap-2 text-red-600 focus:text-red-600"
          >
            <Trash2 class="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
</template>
