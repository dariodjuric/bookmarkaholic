import type { Bookmark } from '@/types/bookmark'
import BookmarkNode from './bookmark-node'
import FolderNode from './folder-node'

interface BookmarkTreeProps {
  bookmarks: Bookmark[]
}

export default function BookmarkTree({ bookmarks }: BookmarkTreeProps) {
  return (
    <>
      {bookmarks.map((bookmark) =>
        bookmark.isFolder ? (
          <FolderNode key={bookmark.id} bookmark={bookmark} depth={0} />
        ) : (
          <BookmarkNode key={bookmark.id} bookmark={bookmark} depth={0} />
        )
      )}
    </>
  )
}
