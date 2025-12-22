import { useEffect } from 'react';
import { useBookmarkStore } from '@/stores/bookmark-store';

export function useBookmarkKeyboardShortcuts() {
  const editingId = useBookmarkStore((state) => state.editingId);
  const cancelEditing = useBookmarkStore((state) => state.cancelEditing);
  const editHoveredBookmark = useBookmarkStore(
    (state) => state.editHoveredBookmark
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelEditing();
      } else if (e.key === 'Enter' && !editingId) {
        e.preventDefault();
        editHoveredBookmark();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingId, cancelEditing, editHoveredBookmark]);
}
