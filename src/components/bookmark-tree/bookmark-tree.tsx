import type { BookmarkTreeProps } from '@/types/bookmark-props'
import BookmarkNode from './bookmark-node'
import FolderNode from './folder-node'

export default function BookmarkTree({
  bookmarks,
  dragOverId,
  editingId,
  onUpdate,
  onDelete,
  onAddFolder,
  onSortFolder,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onSetEditingId,
  onHover,
}: BookmarkTreeProps) {
  return (
    <>
      {bookmarks.map((bookmark) =>
        bookmark.isFolder ? (
          <FolderNode
            key={bookmark.id}
            bookmark={bookmark}
            depth={0}
            isEditing={editingId === bookmark.id}
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
            key={bookmark.id}
            bookmark={bookmark}
            depth={0}
            isEditing={editingId === bookmark.id}
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
    </>
  )
}
