<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Search, Upload, Trash2, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-vue-next'
import { usePostStore } from '@/stores/post'
import { postService } from '@/services'
import { useCategoryStore } from '@/stores/category'
import { useSubcategoryStore } from '@/stores/subcategory'
import { useConfirm } from '@/composables/useConfirm'
import PostFilters from '@/components/posts/PostFilters.vue'
import PostTableRow from '@/components/posts/PostTableRow.vue'
import BatchUploadModal from '@/components/posts/BatchUploadModal.vue'
import { toast } from 'vue-sonner'

const router = useRouter()
const postStore = usePostStore()
const categoryStore = useCategoryStore()
const subcategoryStore = useSubcategoryStore()
const { confirm } = useConfirm()

// Pagination state
const currentPage = ref(1)
const pageSize = ref(10)
const statusFilter = ref<string>('all')
const searchQuery = ref('')
const categoryFilter = ref<number | null>(null)
const subcategoryFilter = ref<number | null>(null)
const featuredFilter = ref<string>('all')
const pinnedFilter = ref<string>('all')
const publicFilter = ref<string>('all')
const sortBy = ref('created_at')
const sortOrder = ref<'ASC' | 'DESC'>('DESC')

// Status counts - fetch separately
const statusCounts = ref({
  all: 0,
  draft: 0,
  published: 0,
  pending: 0,
  archived: 0,
})

// Computed values
const totalPages = computed(() => Math.ceil(postStore.totalPosts / pageSize.value))
const offset = computed(() => (currentPage.value - 1) * pageSize.value)

const batchUploadModalOpen = ref(false)
const selectedPostUuids = ref<string[]>([])

const allSelected = computed({
  get: () => postStore.posts.length > 0 && selectedPostUuids.value.length === postStore.posts.length,
  set: (value: boolean) => {
    if (value) {
      selectedPostUuids.value = postStore.posts.map(p => p.uuid).filter((uuid): uuid is string => uuid !== undefined)
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

const fetchPosts = async () => {
  const params: any = {
    limit: pageSize.value,
    offset: offset.value,
    sort_by: sortBy.value,
    sort_order: sortOrder.value,
  }

  if (statusFilter.value && statusFilter.value !== 'all') {
    params.status = statusFilter.value
  }

  if (searchQuery.value) {
    params.search = searchQuery.value
  }

  if (categoryFilter.value) {
    params.category_id = categoryFilter.value
  }

  if (subcategoryFilter.value) {
    params.sub_category_id = subcategoryFilter.value
  }

  if (featuredFilter.value !== 'all') {
    params.is_featured = featuredFilter.value === 'true'
  }

  if (pinnedFilter.value !== 'all') {
    params.is_pinned = pinnedFilter.value === 'true'
  }

  if (publicFilter.value !== 'all') {
    params.is_public = publicFilter.value === 'true'
  }

  console.log('Fetching posts with params:', params)
  await postStore.fetchPosts(params)
  // Clear selections when fetching new page
  selectedPostUuids.value = []
}

const fetchStatusCounts = async () => {
  // Fetch counts for each status without affecting the main posts display
  try {
    const [allRes, draftRes, publishedRes, pendingRes, archivedRes] = await Promise.all([
      postService.getPosts({ limit: 1, offset: 0 }),
      postService.getPosts({ limit: 1, offset: 0, status: 'draft' }),
      postService.getPosts({ limit: 1, offset: 0, status: 'published' }),
      postService.getPosts({ limit: 1, offset: 0, status: 'pending' }),
      postService.getPosts({ limit: 1, offset: 0, status: 'archived' }),
    ])
    
    statusCounts.value = {
      all: allRes.meta?.total || 0,
      draft: draftRes.meta?.total || 0,
      published: publishedRes.meta?.total || 0,
      pending: pendingRes.meta?.total || 0,
      archived: archivedRes.meta?.total || 0,
    }
  } catch (error) {
    console.error('Failed to fetch status counts:', error)
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Watch for filter changes and reset to page 1
watch([statusFilter, searchQuery, pageSize, categoryFilter, subcategoryFilter, featuredFilter, pinnedFilter, publicFilter, sortBy, sortOrder], () => {
  currentPage.value = 1
  fetchPosts()
})

// Watch for page changes
watch(currentPage, () => {
  fetchPosts()
})

const handleEdit = (id: number) => {
  router.push(`/posts/${id}/edit`)
}

const handlePreview = async (id: number) => {
  try {
    const post = await postStore.fetchPostById(id)
    if (post && post.slug) {
      const previewUrl = `https://bgceac.nesohq.org/archive/post/${post.slug}`
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
    await fetchPosts()
    await fetchStatusCounts()
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
    await fetchPosts()
    await fetchStatusCounts()
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
    await fetchPosts()
    await fetchStatusCounts()
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
    await fetchPosts()
    await fetchStatusCounts()
  }
}

const handleBatchUpload = async (file: File) => {
  try {
    await postStore.bulkUploadPosts(file)
    batchUploadModalOpen.value = false
    await fetchPosts()
    await fetchStatusCounts()
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
      await fetchPosts()
      await fetchStatusCounts()
    } catch (error) {
      console.error('Failed to delete posts:', error)
      toast.error('Failed to delete posts')
    }
  }
}

const handleSeedReadTime = async () => {
  const confirmed = await confirm({
    title: 'Recalculate Read Times',
    message: 'This will flush all caches and recalculate reading times for all posts in the background. Continue?',
    confirmText: 'Yes, Recalculate',
    type: 'warning',
  })

  if (confirmed) {
    try {
      await postStore.seedReadTime()
    } catch (error) {
      console.error('Failed to seed read times:', error)
    }
  }
}

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    subcategoryStore.fetchSubcategories(),
    fetchPosts()
  ])
  fetchStatusCounts() // Don't await this, let it run in background
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
        <Button 
          @click="handleSeedReadTime" 
          variant="outline" 
          size="lg" 
          class="gap-2 border-orange-200 hover:bg-orange-50 dark:border-orange-900/30 dark:hover:bg-orange-900/10 text-orange-600 dark:text-orange-400"
          :disabled="postStore.loading"
        >
          <RefreshCcw :class="['h-4 w-4', { 'animate-spin': postStore.loading }]" />
          Recalculate Read Times
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

    <!-- Advanced Filters -->
    <Card>
      <CardContent class="pt-6">
        <div class="space-y-4">
          <!-- First Row: Per Page and Loading -->
          <div class="flex items-center justify-between pb-4 border-b">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">Show</span>
              <select 
                v-model.number="pageSize"
                class="h-9 w-[100px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <span class="text-sm font-medium">per page</span>
            </div>
            <div v-if="postStore.loading" class="flex items-center gap-2 text-sm text-muted-foreground">
              <div class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              Loading...
            </div>
          </div>

          <!-- Second Row: All Filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Category Filter -->
            <div>
              <label class="text-sm font-medium mb-2 block">Category</label>
              <select 
                v-model.number="categoryFilter"
                class="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option :value="null">All Categories</option>
                <option 
                  v-for="cat in categoryStore.categories.filter(c => c.status === 'approved')" 
                  :key="cat.id" 
                  :value="cat.id"
                >
                  {{ cat.label }}
                </option>
              </select>
            </div>

            <!-- Subcategory Filter -->
            <div>
              <label class="text-sm font-medium mb-2 block">Subcategory</label>
              <select 
                v-model.number="subcategoryFilter"
                class="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                :disabled="!categoryFilter"
              >
                <option :value="null">All Subcategories</option>
                <option 
                  v-for="sub in subcategoryStore.subcategories.filter(s => s.parent_id === categoryFilter && s.status === 'approved')" 
                  :key="sub.id" 
                  :value="sub.id"
                >
                  {{ sub.label }}
                </option>
              </select>
            </div>

            <!-- Featured Filter -->
            <div>
              <label class="text-sm font-medium mb-2 block">Featured</label>
              <select 
                v-model="featuredFilter"
                class="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </select>
            </div>

            <!-- Pinned Filter -->
            <div>
              <label class="text-sm font-medium mb-2 block">Pinned</label>
              <select 
                v-model="pinnedFilter"
                class="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All</option>
                <option value="true">Pinned Only</option>
                <option value="false">Not Pinned</option>
              </select>
            </div>

            <!-- Public Filter -->
            <div>
              <label class="text-sm font-medium mb-2 block">Visibility</label>
              <select 
                v-model="publicFilter"
                class="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All</option>
                <option value="true">Public</option>
                <option value="false">Private</option>
              </select>
            </div>

            <!-- Sort By -->
            <div>
              <label class="text-sm font-medium mb-2 block">Sort By</label>
              <select 
                v-model="sortBy"
                class="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="created_at">Created Date</option>
                <option value="updated_at">Updated Date</option>
                <option value="title">Title</option>
                <option value="view_count">View Count</option>
              </select>
            </div>

            <!-- Sort Order -->
            <div>
              <label class="text-sm font-medium mb-2 block">Order</label>
              <select 
                v-model="sortOrder"
                class="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>

            <!-- Clear Filters Button -->
            <div class="flex items-end">
              <Button 
                variant="outline" 
                class="w-full"
                @click="() => {
                  categoryFilter = null
                  subcategoryFilter = null
                  featuredFilter = 'all'
                  pinnedFilter = 'all'
                  publicFilter = 'all'
                  sortBy = 'created_at'
                  sortOrder = 'DESC'
                }"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Posts Table -->
    <Card>
      <CardHeader>
        <CardTitle class="text-xl">
          {{ postStore.totalPosts }} {{ postStore.totalPosts === 1 ? 'Post' : 'Posts' }}
          <span v-if="postStore.posts.length !== postStore.totalPosts" class="text-sm font-normal text-muted-foreground">
            (Showing {{ offset + 1 }}-{{ Math.min(offset + pageSize, postStore.totalPosts) }})
          </span>
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
                v-for="post in postStore.posts"
                :key="post.id"
                :post="post"
                :selected="post.uuid ? selectedPostUuids.includes(post.uuid) : false"
                @toggle-select="post.uuid && togglePostSelection(post.uuid)"
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
        <div v-if="postStore.posts.length === 0 && !postStore.loading" class="text-center py-12">
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

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 pt-4 border-t">
          <div class="text-sm text-muted-foreground">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              <ChevronLeft class="h-4 w-4" />
              Previous
            </Button>
            
            <!-- Page numbers -->
            <div class="flex items-center gap-1">
              <Button
                v-for="page in Math.min(5, totalPages)"
                :key="page"
                variant="outline"
                size="sm"
                :class="page === currentPage 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-primary dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90' 
                  : 'hover:bg-accent hover:text-accent-foreground'"
                @click="goToPage(page)"
              >
                {{ page }}
              </Button>
              <span v-if="totalPages > 5" class="px-2 text-muted-foreground">...</span>
              <Button
                v-if="totalPages > 5 && currentPage < totalPages - 2"
                variant="outline"
                size="sm"
                :class="totalPages === currentPage 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-primary dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90' 
                  : 'hover:bg-accent hover:text-accent-foreground'"
                @click="goToPage(totalPages)"
              >
                {{ totalPages }}
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Next
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
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
