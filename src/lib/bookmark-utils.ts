import type { Bookmark } from '@/types/bookmark'

// Count total descendants in a folder (recursive)
export function countDescendants(bookmark: Bookmark): number {
  if (!bookmark.isFolder || !bookmark.children) return 0
  return bookmark.children.reduce(
    (count, child) => count + 1 + countDescendants(child),
    0
  )
}

// Calculate left padding based on depth
export function getDepthPadding(depth: number): string {
  return `${depth * 20 + 8}px`
}

// Generate favicon URL for a bookmark
export function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=16`
  } catch {
    return ''
  }
}
