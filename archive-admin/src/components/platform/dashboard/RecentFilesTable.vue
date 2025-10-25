<script setup lang="ts">
    import { ref } from "vue"
    import { Badge } from "@/components/ui/badge"
    import { Button } from "@/components/ui/button"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { FileText, Image, Video, Music, Download, Eye, MoreHorizontal } from "lucide-vue-next"
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

// Define the data for the table as a reactive ref.
const recentFiles = ref([
    {
        id: 1,
        name: "Q3_Financial_Report.pdf",
        type: "document",
        size: "2.4 MB",
        uploadedBy: "John Doe",
        uploadedAt: "2 hours ago",
        status: "active"
    },
    {
        id: 2,
        name: "product_showcase.mp4",
        type: "video",
        size: "157.8 MB",
        uploadedBy: "Sarah Wilson",
        uploadedAt: "4 hours ago",
        status: "processing"
    },
    {
        id: 3,
        name: "team_photo_2024.jpg",
        type: "image",
        size: "5.2 MB",
        uploadedBy: "Mike Johnson",
        uploadedAt: "6 hours ago",
        status: "active"
    },
    {
        id: 4,
        name: "meeting_recording.mp3",
        type: "audio",
        size: "45.1 MB",
        uploadedBy: "Lisa Chen",
        uploadedAt: "1 day ago",
        status: "active"
    },
    {
        id: 5,
        name: "project_documentation.pdf",
        type: "document",
        size: "1.8 MB",
        uploadedBy: "David Brown",
        uploadedAt: "2 days ago",
        status: "archived"
    }
])

// A function that returns the correct icon component based on file type.
const getFileIcon = (type: string) => {
    switch (type) {
        case "document":
            return FileText
        case "image":
            return Image
        case "video":
            return Video
        case "audio":
            return Music
        default:
            return FileText
    }
}
</script>

<template>
    <Card class="bg-gradient-card border-0 shadow-md">
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                <span>Recent Files</span>
                <Button variant="outline" size="sm">
                    View All
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead class="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <!-- Loop through the reactive data -->
                    <TableRow v-for="file in recentFiles" :key="file.id" class="hover:bg-muted/50">
                        <TableCell>
                            <div class="flex items-center gap-3">
                                <!-- Dynamically render the icon based on file type -->
                                <component :is="getFileIcon(file.type)" class="h-4 w-4 text-blue-600" />
                                <div>
                                    <p class="font-medium text-foreground">{{ file.name }}</p>
                                    <p class="text-sm text-muted-foreground capitalize">{{ file.type }}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell class="text-muted-foreground">{{ file.size }}</TableCell>
                        <TableCell class="text-muted-foreground">{{ file.uploadedBy }}</TableCell>
                        <TableCell class="text-muted-foreground">{{ file.uploadedAt }}</TableCell>
                        <TableCell>
                            <!-- Dynamically render the status badge -->
                            <Badge v-if="file.status === 'active'" variant="default"
                                class="bg-success text-success-foreground">Active</Badge>
                            <Badge v-else-if="file.status === 'processing'" variant="secondary"
                                class="bg-warning text-warning-foreground">Processing</Badge>
                            <Badge v-else-if="file.status === 'archived'" variant="outline">Archived</Badge>
                            <Badge v-else variant="outline">{{ file.status }}</Badge>
                        </TableCell>
                        <TableCell class="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal class="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Eye class="mr-2 h-4 w-4" />
                                        Preview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Download class="mr-2 h-4 w-4" />
                                        Download
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</template>