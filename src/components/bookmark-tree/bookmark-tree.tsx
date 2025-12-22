import type { BookmarkOrFolder } from '@/types/bookmark';
import { isFolder } from '@/types/bookmark';
import BookmarkNodeComponent from './bookmark-node';
import FolderNode from './folder-node';

interface BookmarkTreeProps {
  bookmarksOrFolders: BookmarkOrFolder[];
}

export default function BookmarkTree({
  bookmarksOrFolders,
}: BookmarkTreeProps) {
  return (
    <>
      {bookmarksOrFolders.map((node) =>
        isFolder(node) ? (
          <FolderNode key={node.id} folder={node} depth={0} />
        ) : (
          <BookmarkNodeComponent key={node.id} bookmark={node} depth={0} />
        )
      )}
    </>
  );
}
