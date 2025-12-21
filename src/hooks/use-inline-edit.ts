import { useState, useEffect, useRef, useCallback } from 'react'
import type { Bookmark } from '@/types/bookmark'

interface UseInlineEditOptions {
  bookmark: Bookmark
  isEditing: boolean
  onUpdate: (id: string, updates: Partial<Bookmark>) => void
  onSetEditingId: (id: string | null) => void
  isRoot: boolean
}

export function useInlineEdit({
  bookmark,
  isEditing,
  onUpdate,
  onSetEditingId,
  isRoot,
}: UseInlineEditOptions) {
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
    onUpdate(bookmark.id, {
      title: editTitle,
      url: bookmark.isFolder ? undefined : editUrl,
    })
  }, [bookmark.id, bookmark.isFolder, editTitle, editUrl, isRoot, onUpdate])

  const handleCancel = useCallback(() => {
    onSetEditingId(null)
  }, [onSetEditingId])

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
