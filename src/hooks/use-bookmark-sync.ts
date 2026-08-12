import { useEffect } from 'react';
import { subscribeToBookmarkChanges } from '@/lib/chrome-bookmarks';
import { useBookmarkStore } from '@/stores/bookmark-store';

// Keep the UI in sync with bookmark changes made outside the extension
// (other tabs, the native bookmark manager, device sync, etc.).
export function useBookmarkSync() {
  const refreshBookmarks = useBookmarkStore((state) => state.refreshBookmarks);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const unsubscribe = subscribeToBookmarkChanges(() => {
      // Debounce so a single drag/move or import that emits several events
      // results in just one refetch.
      clearTimeout(timer);
      timer = setTimeout(() => refreshBookmarks(), 200);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [refreshBookmarks]);
}
