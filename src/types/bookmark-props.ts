import type React from 'react'
import type { Bookmark } from './bookmark'

// Base props shared by both BookmarkNode and FolderNode
export interface BaseNodeProps {
  bookmark: Bookmark
  depth: number
  isEditing: boolean
  dragOverId: string | null
  onUpdate: (id: string, updates: Partial<Bookmark>) => void
  onDelete: (id: string) => void
  onSetEditingId: (id: string | null) => void
  onHover: (id: string | null) => void
  onDragStart: (e: React.DragEvent, bookmark: Bookmark) => void
  onDragOver: (e: React.DragEvent, bookmark: Bookmark) => void
  onDrop: (e: React.DragEvent, targetBookmark: Bookmark) => void
  onDragEnd: () => void
}

// Props for BookmarkNode
export interface BookmarkNodeProps extends BaseNodeProps {}

// Additional props only needed by FolderNode
export interface FolderNodeProps extends BaseNodeProps {
  editingId: string | null // needed for recursive children
  onAddFolder: (parentId: string, folderName: string) => void
  onSortFolder: (folderId: string) => void
}

// Props for the BookmarkTree container
export interface BookmarkTreeProps {
  bookmarks: Bookmark[]
  dragOverId: string | null
  editingId: string | null
  onUpdate: (id: string, updates: Partial<Bookmark>) => void
  onDelete: (id: string) => void
  onAddFolder: (parentId: string, folderName: string) => void
  onSortFolder: (folderId: string) => void
  onDragStart: (e: React.DragEvent, bookmark: Bookmark) => void
  onDragOver: (e: React.DragEvent, bookmark: Bookmark) => void
  onDrop: (e: React.DragEvent, targetBookmark: Bookmark) => void
  onDragEnd: () => void
  onSetEditingId: (id: string | null) => void
  onHover: (id: string | null) => void
}
