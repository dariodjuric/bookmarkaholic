import { useState, useEffect, useRef, useCallback } from 'react'
import type { Bookmark } from '@/types/bookmark'
import { useBookmarkStore } from '@/stores/bookmark-store'

interface UseInlineEditOptions {
  bookmark: Bookmark
  isRoot: boolean
}

export function useInlineEdit({ bookmark, isRoot }: UseInlineEditOptions) {
  const editingId = useBookmarkStore((state) => state.editingId)
  const saveBookmarkEdit = useBookmarkStore((state) => state.saveBookmarkEdit)
  const cancelEditing = useBookmarkStore((state) => state.cancelEditing)

  const isEditing = editingId === bookmark.id

  const [editTitle, setEditTitle] = useState(bookmark.title)
  const [editUrl, setEditUrl] = useState(bookmark.url || '')
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      const timer = setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus()
          const len = titleInputRef.current.value.length
          titleInputRef.current.setSelectionRange(len, len)
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isEditing])

  // Reset values when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditTitle(bookmark.title)
      setEditUrl(bookmark.url || '')
    }
  }, [isEditing, bookmark.title, bookmark.url])

  const handleSave = useCallback(() => {
    if (isRoot) return
    saveBookmarkEdit(bookmark.id, {
      title: editTitle,
      url: bookmark.isFolder ? undefined : editUrl,
    })
  }, [
    bookmark.id,
    bookmark.isFolder,
    editTitle,
    editUrl,
    isRoot,
    saveBookmarkEdit,
  ])

  const handleCancel = useCallback(() => {
    cancelEditing()
  }, [cancelEditing])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.stopPropagation()
        handleSave()
      } else if (e.key === 'Escape') {
        e.stopPropagation()
        handleCancel()
      }
    },
    [handleSave, handleCancel]
  )

  return {
    isEditing,
    editTitle,
    setEditTitle,
    editUrl,
    setEditUrl,
    titleInputRef,
    handleSave,
    handleCancel,
    handleKeyDown,
  }
}
