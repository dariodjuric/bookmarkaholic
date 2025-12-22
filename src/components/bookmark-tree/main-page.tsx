import { Button } from '@/components/ui/button';
import { useBookmarkKeyboardShortcuts } from '@/hooks/use-bookmark-keyboard-shortcuts';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { BookmarkPlus, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import BookmarkTree from './bookmark-tree';

export default function MainPage() {
  const bookmarksOrFolders = useBookmarkStore(
    (state) => state.bookmarksOrFolders
  );
  const status = useBookmarkStore((state) => state.status);
  const error = useBookmarkStore((state) => state.error);
  const loadBookmarks = useBookmarkStore((state) => state.loadBookmarks);
  const addBookmark = useBookmarkStore((state) => state.addBookmark);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useBookmarkKeyboardShortcuts();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive">
        <p>Error: {error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => loadBookmarks()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => addBookmark()}>
          <BookmarkPlus className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
      </div>
      <div
        className="rounded-lg border bg-card"
        onDragOver={(e) => e.preventDefault()}
      >
        {bookmarksOrFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No bookmarks yet</p>
            <p className="text-sm">Add a bookmark or folder to get started</p>
          </div>
        ) : (
          <BookmarkTree bookmarksOrFolders={bookmarksOrFolders} />
        )}
      </div>
    </div>
  );
}
