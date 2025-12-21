import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isRootFolder } from '@/lib/chrome-bookmarks'
import { cn } from '@/lib/utils'
import { getDepthPadding } from '@/lib/bookmark-utils'
import { useInlineEdit } from '@/hooks/use-inline-edit'
import { useBookmarkStore } from '@/stores/bookmark-store'
import DeleteDialog from './dialogs/delete-dialog'
import AddFolderDialog from './dialogs/add-folder-dialog'
import BookmarkNode from './bookmark-node'
import type { Bookmark } from '@/types/bookmark'
import {
  ArrowDownAZ,
  ChevronRight,
  Folder,
  FolderOpen,
  FolderPlus,
  GripVertical,
  Trash2,
} from 'lucide-react'

interface FolderNodeProps {
  bookmark: Bookmark
  depth: number
}

export default function FolderNode({ bookmark, depth }: FolderNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const dragOverFolderId = useBookmarkStore((state) => state.dragOverFolderId)
  const startEditing = useBookmarkStore((state) => state.startEditing)
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark)
  const addFolder = useBookmarkStore((state) => state.addFolder)
  const sortFolderContents = useBookmarkStore(
    (state) => state.sortFolderContents
  )
  const startDragging = useBookmarkStore((state) => state.startDragging)
  const hoverDropTarget = useBookmarkStore((state) => state.hoverDropTarget)
  const clearDropTarget = useBookmarkStore((state) => state.clearDropTarget)
  const dropIntoFolder = useBookmarkStore((state) => state.dropIntoFolder)
  const endDrag = useBookmarkStore((state) => state.endDrag)
  const setHoveredBookmark = useBookmarkStore(
    (state) => state.setHoveredBookmark
  )
  const clearHoveredBookmark = useBookmarkStore(
    (state) => state.clearHoveredBookmark
  )

  const isRoot = isRootFolder(bookmark.id)
  const isDragOverThis = dragOverFolderId === bookmark.id

  const {
    isEditing,
    editTitle,
    setEditTitle,
    titleInputRef,
    handleSave,
    handleCancel,
    handleKeyDown,
  } = useInlineEdit({
    bookmark,
    isRoot,
  })

  const handleDragStart = (e: React.DragEvent) => {
    if (isRoot) {
      e.preventDefault()
      return
    }
    startDragging(bookmark)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    hoverDropTarget(bookmark.id)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dropIntoFolder(bookmark.id)
  }

  const handleDragLeave = () => {
    clearDropTarget()
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          'group flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors',
          'hover:bg-accent',
          isDragOverThis && 'bg-accent ring-2 ring-primary'
        )}
        style={{ paddingLeft: getDepthPadding(depth) }}
        draggable={!isEditing && !isRoot}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragEnd={endDrag}
        onMouseEnter={() => setHoveredBookmark(bookmark.id)}
        onMouseLeave={clearHoveredBookmark}
      >
        {!isRoot && (
          <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
        {isRoot && <div className="w-4" />}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform',
              isExpanded && 'rotate-90'
            )}
          />
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-amber-500" />
          ) : (
            <Folder className="h-4 w-4 text-amber-500" />
          )}
        </button>

        {isEditing && !isRoot ? (
          <div className="flex flex-1 items-center gap-2">
            <Input
              ref={titleInputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Title"
              className="h-7 flex-1"
            />
            <Button
              type="button"
              size="sm"
              className="h-7 px-2"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2 bg-transparent"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={() => !isRoot && startEditing(bookmark.id)}
            className={cn(
              'flex flex-1 items-center gap-2 text-left min-w-0',
              !isRoot && 'cursor-pointer',
              isRoot && 'cursor-default'
            )}
          >
            <span className="truncate max-w-48">{bookmark.title}</span>
          </button>
        )}

        {!isEditing && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                sortFolderContents(bookmark.id)
              }}
              title="Sort by name"
            >
              <ArrowDownAZ className="size-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                setIsAddFolderOpen(true)
              }}
            >
              <FolderPlus className="size-4 text-muted-foreground" />
            </Button>
          </>
        )}

        {!isEditing && !isRoot && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              setIsDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </div>

      {isExpanded && bookmark.children && (
        <div>
          {bookmark.children.map((child) =>
            child.isFolder ? (
              <FolderNode key={child.id} bookmark={child} depth={depth + 1} />
            ) : (
              <BookmarkNode key={child.id} bookmark={child} depth={depth + 1} />
            )
          )}
        </div>
      )}

      <AddFolderDialog
        open={isAddFolderOpen}
        onOpenChange={setIsAddFolderOpen}
        onSubmit={(folderName) => addFolder(bookmark.id, folderName)}
      />

      <DeleteDialog
        bookmark={bookmark}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => removeBookmark(bookmark.id)}
      />
    </div>
  )
}
