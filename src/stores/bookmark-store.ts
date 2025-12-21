import { create } from 'zustand'
import type { Bookmark } from '@/types/bookmark'
import {
  fetchBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  moveBookmark,
  sortFolderByName,
  isRootFolder,
} from '@/lib/chrome-bookmarks'

interface BookmarkState {
  // Core data
  bookmarks: Bookmark[]

  // Loading & error states
  status: 'idle' | 'loading' | 'error'
  error: string | null

  // UI interaction states
  editingId: string | null
  draggedBookmark: Bookmark | null
  dragOverFolderId: string | null
  hoveredId: string | null
}

interface BookmarkActions {
  // Data loading
  loadBookmarks: () => Promise<void>
  refreshBookmarks: () => Promise<void>

  // Bookmark CRUD
  addBookmark: (parentId?: string) => Promise<void>
  addFolder: (parentId: string, folderName: string) => Promise<void>
  saveBookmarkEdit: (
    id: string,
    updates: { title?: string; url?: string }
  ) => Promise<void>
  removeBookmark: (id: string) => Promise<void>
  sortFolderContents: (folderId: string) => Promise<void>

  // Editing
  startEditing: (bookmarkId: string) => void
  cancelEditing: () => void
  editHoveredBookmark: () => void

  // Drag & drop
  startDragging: (bookmark: Bookmark) => void
  hoverDropTarget: (folderId: string) => void
  clearDropTarget: () => void
  dropIntoFolder: (targetFolderId: string) => Promise<void>
  endDrag: () => void

  // Hover (for keyboard shortcuts)
  setHoveredBookmark: (bookmarkId: string) => void
  clearHoveredBookmark: () => void
}

type BookmarkStore = BookmarkState & BookmarkActions

// Helper to find a bookmark by ID in the tree
const findBookmarkById = (id: string, items: Bookmark[]): Bookmark | null => {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findBookmarkById(id, item.children)
      if (found) return found
    }
  }
  return null
}

// Helper to check if a bookmark is a descendant of another
const isDescendant = (parent: Bookmark, childId: string): boolean => {
  if (parent.id === childId) return true
  if (parent.children) {
    return parent.children.some((child) => isDescendant(child, childId))
  }
  return false
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  // Initial state
  bookmarks: [],
  status: 'idle',
  error: null,
  editingId: null,
  draggedBookmark: null,
  dragOverFolderId: null,
  hoveredId: null,

  // Data loading actions
  loadBookmarks: async () => {
    try {
      set({ status: 'loading', error: null })
      const data = await fetchBookmarks()
      set({ bookmarks: data, status: 'idle' })
    } catch (err) {
      set({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to load bookmarks',
      })
    }
  },

  refreshBookmarks: async () => {
    try {
      const data = await fetchBookmarks()
      set({ bookmarks: data })
    } catch (err) {
      console.error('Failed to refresh bookmarks:', err)
    }
  },

  // Bookmark CRUD actions
  addBookmark: async (parentId) => {
    try {
      const { bookmarks } = get()
      const targetParentId = parentId || bookmarks[0]?.id || '1'
      await createBookmark(
        targetParentId,
        'New Bookmark',
        'https://example.com'
      )
      await get().refreshBookmarks()
    } catch (err) {
      console.error('Failed to create bookmark:', err)
    }
  },

  addFolder: async (parentId, folderName) => {
    try {
      await createBookmark(parentId, folderName)
      await get().refreshBookmarks()
    } catch (err) {
      console.error('Failed to create folder:', err)
    }
  },

  saveBookmarkEdit: async (id, updates) => {
    if (isRootFolder(id)) return

    try {
      await updateBookmark(id, {
        title: updates.title,
        url: updates.url,
      })
      set({ editingId: null })
      await get().refreshBookmarks()
    } catch (err) {
      console.error('Failed to update bookmark:', err)
    }
  },

  removeBookmark: async (id) => {
    if (isRootFolder(id)) return

    try {
      const { bookmarks } = get()
      const bookmark = findBookmarkById(id, bookmarks)
      if (bookmark) {
        await deleteBookmark(id, bookmark.isFolder)
        await get().refreshBookmarks()
      }
    } catch (err) {
      console.error('Failed to delete bookmark:', err)
    }
  },

  sortFolderContents: async (folderId) => {
    try {
      await sortFolderByName(folderId)
      await get().refreshBookmarks()
    } catch (err) {
      console.error('Failed to sort folder:', err)
    }
  },

  // Editing actions
  startEditing: (bookmarkId) => {
    if (isRootFolder(bookmarkId)) return
    set({ editingId: bookmarkId })
  },

  cancelEditing: () => {
    set({ editingId: null })
  },

  editHoveredBookmark: () => {
    const { hoveredId, editingId } = get()
    if (!editingId && hoveredId && !isRootFolder(hoveredId)) {
      set({ editingId: hoveredId })
    }
  },

  // Drag & drop actions
  startDragging: (bookmark) => {
    if (isRootFolder(bookmark.id)) return
    set({ draggedBookmark: bookmark })
  },

  hoverDropTarget: (folderId) => {
    const { draggedBookmark } = get()
    if (draggedBookmark && draggedBookmark.id !== folderId) {
      set({ dragOverFolderId: folderId })
    }
  },

  clearDropTarget: () => {
    set({ dragOverFolderId: null })
  },

  dropIntoFolder: async (targetFolderId) => {
    const { draggedBookmark } = get()

    if (!draggedBookmark || draggedBookmark.id === targetFolderId) {
      set({ draggedBookmark: null, dragOverFolderId: null })
      return
    }

    if (isRootFolder(draggedBookmark.id)) {
      set({ draggedBookmark: null, dragOverFolderId: null })
      return
    }

    // Prevent dropping a folder into itself or its descendants
    if (
      draggedBookmark.isFolder &&
      isDescendant(draggedBookmark, targetFolderId)
    ) {
      set({ draggedBookmark: null, dragOverFolderId: null })
      return
    }

    try {
      await moveBookmark(draggedBookmark.id, { parentId: targetFolderId })
      await get().refreshBookmarks()
    } catch (err) {
      console.error('Failed to move bookmark:', err)
    }

    set({ draggedBookmark: null, dragOverFolderId: null })
  },

  endDrag: () => {
    set({ draggedBookmark: null, dragOverFolderId: null })
  },

  // Hover actions
  setHoveredBookmark: (bookmarkId) => {
    set({ hoveredId: bookmarkId })
  },

  clearHoveredBookmark: () => {
    set({ hoveredId: null })
  },
}))
