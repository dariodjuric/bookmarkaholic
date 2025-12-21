import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getDepthPadding, getFaviconUrl } from '@/lib/bookmark-utils'
import { useInlineEdit } from '@/hooks/use-inline-edit'
import DeleteDialog from './dialogs/delete-dialog'
import type { BookmarkNodeProps } from '@/types/bookmark-props'
import { ExternalLink, GripVertical, Trash2 } from 'lucide-react'

export default function BookmarkNode({
  bookmark,
  depth,
  isEditing,
  onUpdate,
  onDelete,
  onSetEditingId,
  onHover,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: BookmarkNodeProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    editTitle,
    setEditTitle,
    editUrl,
    setEditUrl,
    titleInputRef,
    handleSave,
    handleCancel,
    handleKeyDown,
  } = useInlineEdit({
    bookmark,
    isEditing,
    onUpdate,
    onSetEditingId,
    isRoot: false,
  })

  return (
    <div className="select-none">
      <div
        className={cn(
          'group flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors',
          'hover:bg-accent'
        )}
        style={{ paddingLeft: getDepthPadding(depth) }}
        draggable={!isEditing}
        onDragStart={(e) => onDragStart(e, bookmark)}
        onDragOver={(e) => onDragOver(e, bookmark)}
        onDrop={(e) => onDrop(e, bookmark)}
        onDragEnd={onDragEnd}
        onMouseEnter={() => onHover(bookmark.id)}
        onMouseLeave={() => onHover(null)}
      >
        <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="flex items-center gap-1 pl-5">
          <img
            src={getFaviconUrl(bookmark.url || '')}
            alt=""
            className="h-4 w-4"
          />
        </div>

        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <Input
              ref={titleInputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Title"
              className="h-7 flex-1"
            />
            <Input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="URL"
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
          <>
            <button
              onClick={() => onSetEditingId(bookmark.id)}
              className="flex flex-1 items-center gap-2 text-left min-w-0 cursor-pointer"
            >
              <span className="truncate max-w-48">{bookmark.title}</span>
              {bookmark.url && (
                <span className="truncate max-w-72 text-xs text-muted-foreground">
                  {bookmark.url}
                </span>
              )}
            </button>
            {bookmark.url && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(bookmark.url, '_blank', 'noopener,noreferrer')
                }}
                title="Open in new tab"
              >
                <ExternalLink className="size-4 text-muted-foreground" />
              </Button>
            )}
          </>
        )}

        {!isEditing && (
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

      <DeleteDialog
        bookmark={bookmark}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => onDelete(bookmark.id)}
      />
    </div>
  )
}
