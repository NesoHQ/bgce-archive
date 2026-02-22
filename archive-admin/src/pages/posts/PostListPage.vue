<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Search, Upload, Trash2 } from 'lucide-vue-next'
import { usePostStore } from '@/stores/post'
import { useConfirm } from '@/composables/useConfirm'
import { usePostFilters } from '@/composables/usePostFilters'
import PostFilters from '@/components/posts/PostFilters.vue'
import PostTableRow from '@/components/posts/PostTableRow.vue'
import BatchUploadModal from '@/components/posts/BatchUploadModal.vue'
import { toast } from 'vue-sonner'

const router = useRouter()
const postStore = usePostStore()
const { confirm } = useConfirm()

const { statusFilter, searchQuery, filteredPosts, statusCounts } = usePostFilters(() => postStore.posts)
const batchUploadModalOpen = ref(false)
const selectedPostUuids = ref<string[]>([])

const allSelected = computed({
  get: () => filteredPosts.value.length > 0 && selectedPostUuids.value.length === filteredPosts.value.length,
  set: (value: boolean) => {
    if (value) {
      selectedPostUuids.value = filteredPosts.value.map(p => p.uuid)
    } else {
      selectedPostUuids.value = []
    }
  }
})

const togglePostSelection = (uuid: string) => {
  const index = selectedPostUuids.value.indexOf(uuid)
  if (index > -1) {
    selectedPostUuids.value.splice(index, 1)
  } else {
    selectedPostUuids.value.push(uuid)
  }
}

const handleEdit = (id: number) => {
  router.push(`/posts/${id}/edit`)
}

const handlePreview = async (id: number) => {
  try {
    const post = await postStore.fetchPostById(id)
    if (post && post.slug) {
      const previewUrl = `http://localhost:3000/archive/post/${post.slug}`
      window.open(previewUrl, '_blank')
    }
  } catch (error) {
    console.error('Failed to preview post:', error)
  }
}

const handleDelete = async (id: number) => {
  const confirmed = await confirm({
    title: 'Delete Post',
    message: 'Are you sure you want to delete this post? This action cannot be undone.',
    confirmText: 'Delete',
    type: 'danger',
  })
  if (confirmed) {
    await postStore.deletePost(id)
  }
}

const handlePublish = async (id: number) => {
  const confirmed = await confirm({
    title: 'Publish Post',
    message: 'Are you sure you want to publish this post?',
    confirmText: 'Publish',
    type: 'info',
  })
  if (confirmed) {
    await postStore.publishPost(id)
  }
}

const handleUnpublish = async (id: number) => {
  const confirmed = await confirm({
    title: 'Unpublish Post',
    message: 'This will make the post private. Continue?',
    confirmText: 'Unpublish',
    type: 'warning',
  })
  if (confirmed) {
    await postStore.unpublishPost(id)
  }
}

const handleArchive = async (id: number) => {
  const confirmed = await confirm({
    title: 'Archive Post',
    message: 'This will archive the post. You can restore it later.',
    confirmText: 'Archive',
    type: 'warning',
  })
  if (confirmed) {
    await postStore.archivePost(id)
  }
}

const handleBatchUpload = async (file: File) => {
  try {
    await postStore.bulkUploadPosts(file)
    batchUploadModalOpen.value = false
  } catch (error) {
    console.error('Failed to upload posts:', error)
  }
}

const handleBatchDelete = async () => {
  if (selectedPostUuids.value.length === 0) {
    toast.error('No posts selected', {
      description: 'Please select at least one post to delete'
    })
    return
  }

  const confirmed = await confirm({
    title: 'Delete Selected Posts',
    message: `Are you sure you want to delete ${selectedPostUuids.value.length} post(s)? This action cannot be undone.`,
    confirmText: 'Delete All',
    type: 'danger',
  })

  if (confirmed) {
    try {
      await postStore.batchDeletePosts(selectedPostUuids.value)
      selectedPostUuids.value = []
      toast.success('Posts deleted successfully')
    } catch (error) {
      console.error('Failed to delete posts:', error)
      toast.error('Failed to delete posts')
    }
  }
}

onMounted(() => {
  postStore.fetchPosts()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Posts</h1>
        <p class="text-muted-foreground mt-1">Manage and organize your content</p>
      </div>
      <div class="flex gap-3">
        <Button 
          v-if="selectedPostUuids.length > 0"
          @click="handleBatchDelete" 
          variant="destructive" 
          size="lg" 
          class="gap-2"
        >
          <Trash2 class="h-4 w-4" />
          Delete Selected ({{ selectedPostUuids.length }})
        </Button>
        <Button @click="batchUploadModalOpen = true" variant="outline" size="lg" class="gap-2">
          <Upload class="h-4 w-4" />
          Batch Upload
        </Button>
        <Button @click="router.push('/posts/new')" size="lg" class="gap-2">
          <Plus class="h-4 w-4" />
          Create Post
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <PostFilters
      v-model:search-query="searchQuery"
      v-model:status-filter="statusFilter"
      :status-counts="statusCounts"
    />

    <!-- Posts Table -->
    <Card>
      <CardHeader>
        <CardTitle class="text-xl">
          {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'Post' : 'Posts' }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow class="bg-muted/50">
                <TableHead class="w-12">
                  <Checkbox 
                    :checked="allSelected"
                    @update:checked="allSelected = $event"
                  />
                </TableHead>
                <TableHead class="font-semibold">Title</TableHead>
                <TableHead class="font-semibold">Category</TableHead>
                <TableHead class="font-semibold">Status</TableHead>
                <TableHead class="font-semibold">Created</TableHead>
                <TableHead class="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <PostTableRow
                v-for="post in filteredPosts"
                :key="post.id"
                :post="post"
                :selected="selectedPostUuids.includes(post.uuid)"
                @toggle-select="togglePostSelection(post.uuid)"
                @edit="handleEdit"
                @preview="handlePreview"
                @delete="handleDelete"
                @publish="handlePublish"
                @unpublish="handleUnpublish"
                @archive="handleArchive"
              />
            </TableBody>
          </Table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPosts.length === 0" class="text-center py-12">
          <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Search class="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 class="text-lg font-semibold mb-2">No posts found</h3>
          <p class="text-sm text-muted-foreground mb-4">
            {{ searchQuery ? 'Try adjusting your search' : 'Get started by creating your first post' }}
          </p>
          
          <Button v-if="!searchQuery" @click="router.push('/posts/new')">
            <Plus class="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Batch Upload Modal -->
    <BatchUploadModal
      v-model:open="batchUploadModalOpen"
      @submit="handleBatchUpload"
    />
  </div>
</template>
