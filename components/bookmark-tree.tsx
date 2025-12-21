"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { Bookmark } from "@/types/bookmark"
import { sampleBookmarks } from "@/lib/sample-bookmarks"
import { BookmarkItem } from "./bookmark-item"
import { BookmarkPlus, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BookmarkTree() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(sampleBookmarks)
  const [draggedBookmark, setDraggedBookmark] = useState<Bookmark | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const findBookmarkById = useCallback((id: string, items: Bookmark[]): Bookmark | null => {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children) {
        const found = findBookmarkById(id, item.children)
        if (found) return found
      }
    }
    return null
  }, [])

  const removeBookmarkById = useCallback((id: string, items: Bookmark[]): Bookmark[] => {
    return items
      .filter((item) => item.id !== id)
      .map((item) => ({
        ...item,
        children: item.children ? removeBookmarkById(id, item.children) : undefined,
      }))
  }, [])

  const updateBookmarkById = useCallback((id: string, updates: Partial<Bookmark>, items: Bookmark[]): Bookmark[] => {
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, ...updates }
      }
      if (item.children) {
        return {
          ...item,
          children: updateBookmarkById(id, updates, item.children),
        }
      }
      return item
    })
  }, [])

  const addBookmarkToFolder = useCallback(
    (folderId: string | null, bookmark: Bookmark, items: Bookmark[]): Bookmark[] => {
      if (folderId === null) {
        return [...items, { ...bookmark, parentId: null }]
      }

      return items.map((item) => {
        if (item.id === folderId && item.isFolder) {
          return {
            ...item,
            children: [...(item.children || []), { ...bookmark, parentId: folderId }],
          }
        }
        if (item.children) {
          return {
            ...item,
            children: addBookmarkToFolder(folderId, bookmark, item.children),
          }
        }
        return item
      })
    },
    [],
  )

  const handleUpdate = useCallback(
    (id: string, updates: Partial<Bookmark>) => {
      setBookmarks((prev) => updateBookmarkById(id, updates, prev))
    },
    [updateBookmarkById],
  )

  const handleDelete = useCallback(
    (id: string) => {
      setBookmarks((prev) => removeBookmarkById(id, prev))
    },
    [removeBookmarkById],
  )

  const handleDragStart = useCallback((e: React.DragEvent, bookmark: Bookmark) => {
    setDraggedBookmark(bookmark)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent, bookmark: Bookmark) => {
      e.preventDefault()
      if (bookmark.isFolder && draggedBookmark?.id !== bookmark.id) {
        setDragOverId(bookmark.id)
      }
    },
    [draggedBookmark],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent, targetBookmark: Bookmark) => {
      e.preventDefault()
      setDragOverId(null)

      if (!draggedBookmark || draggedBookmark.id === targetBookmark.id) {
        return
      }

      // Prevent dropping a folder into itself or its children
      const isDescendant = (parent: Bookmark, childId: string): boolean => {
        if (parent.id === childId) return true
        if (parent.children) {
          return parent.children.some((child) => isDescendant(child, childId))
        }
        return false
      }

      if (draggedBookmark.isFolder && isDescendant(draggedBookmark, targetBookmark.id)) {
        return
      }

      if (targetBookmark.isFolder) {
        setBookmarks((prev) => {
          const removed = removeBookmarkById(draggedBookmark.id, prev)
          return addBookmarkToFolder(targetBookmark.id, draggedBookmark, removed)
        })
      }
    },
    [draggedBookmark, removeBookmarkById, addBookmarkToFolder],
  )

  const handleDragEnd = useCallback(() => {
    setDraggedBookmark(null)
    setDragOverId(null)
  }, [])

  const handleAddBookmark = () => {
    const newBookmark: Bookmark = {
      id: `new-${Date.now()}`,
      title: "New Bookmark",
      url: "https://example.com",
      isFolder: false,
      parentId: null,
    }
    setBookmarks((prev) => [...prev, newBookmark])
  }

  const handleAddFolder = () => {
    const newFolder: Bookmark = {
      id: `folder-${Date.now()}`,
      title: "New Folder",
      isFolder: true,
      parentId: null,
      children: [],
    }
    setBookmarks((prev) => [...prev, newFolder])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleAddBookmark}>
          <BookmarkPlus className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
        <Button variant="outline" size="sm" onClick={handleAddFolder}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Add Folder
        </Button>
      </div>
      <div className="rounded-lg border bg-card" onDragOver={(e) => e.preventDefault()}>
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No bookmarks yet</p>
            <p className="text-sm">Add a bookmark or folder to get started</p>
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              depth={0}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              isDragOver={dragOverId === bookmark.id}
              dragOverId={dragOverId}
            />
          ))
        )}
      </div>
    </div>
  )
}
