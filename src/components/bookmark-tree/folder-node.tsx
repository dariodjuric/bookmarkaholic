import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isRootFolder } from '@/lib/chrome-bookmarks'
import { cn } from '@/lib/utils'
import { getDepthPadding } from '@/lib/bookmark-utils'
import { useInlineEdit } from '@/hooks/use-inline-edit'
import DeleteDialog from './dialogs/delete-dialog'
import AddFolderDialog from './dialogs/add-folder-dialog'
import BookmarkNode from './bookmark-node'
import type { FolderNodeProps } from '@/types/bookmark-props'
import {
  ArrowDownAZ,
  ChevronRight,
  Folder,
  FolderOpen,
  FolderPlus,
  GripVertical,
  Trash2,
} from 'lucide-react'

export default function FolderNode({
  bookmark,
  depth,
  isEditing,
  editingId,
  dragOverId,
  onUpdate,
  onDelete,
  onAddFolder,
  onSortFolder,
  onSetEditingId,
  onHover,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: FolderNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const isRoot = isRootFolder(bookmark.id)
  const isDragOverThis = dragOverId === bookmark.id

  const {
    editTitle,
    setEditTitle,
    titleInputRef,
    handleSave,
    handleCancel,
    handleKeyDown,
  } = useInlineEdit({
    bookmark,
    isEditing,
    onUpdate,
    onSetEditingId,
    isRoot,
  })

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
        onDragStart={(e) => onDragStart(e, bookmark)}
        onDragOver={(e) => onDragOver(e, bookmark)}
        onDrop={(e) => onDrop(e, bookmark)}
        onDragEnd={onDragEnd}
        onMouseEnter={() => onHover(bookmark.id)}
        onMouseLeave={() => onHover(null)}
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
            onClick={() => !isRoot && onSetEditingId(bookmark.id)}
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
                onSortFolder(bookmark.id)
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
              <FolderNode
                key={child.id}
                bookmark={child}
                depth={depth + 1}
                isEditing={editingId === child.id}
                editingId={editingId}
                dragOverId={dragOverId}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAddFolder={onAddFolder}
                onSortFolder={onSortFolder}
                onSetEditingId={onSetEditingId}
                onHover={onHover}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              />
            ) : (
              <BookmarkNode
                key={child.id}
                bookmark={child}
                depth={depth + 1}
                isEditing={editingId === child.id}
                dragOverId={dragOverId}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onSetEditingId={onSetEditingId}
                onHover={onHover}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              />
            )
          )}
        </div>
      )}

      <AddFolderDialog
        open={isAddFolderOpen}
        onOpenChange={setIsAddFolderOpen}
        onSubmit={(folderName) => onAddFolder(bookmark.id, folderName)}
      />

      <DeleteDialog
        bookmark={bookmark}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => onDelete(bookmark.id)}
      />
    </div>
  )
}
