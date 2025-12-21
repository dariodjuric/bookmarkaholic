export interface Bookmark {
  id: string
  title: string
  url: string
  parentId: string | null
}

export interface Folder {
  id: string
  title: string
  children: BookmarkOrFolder[]
  parentId: string | null
}

export type BookmarkOrFolder = Bookmark | Folder

// Type guards
export function isFolder(node: BookmarkOrFolder): node is Folder {
  return 'children' in node
}

export function isBookmark(node: BookmarkOrFolder): node is Bookmark {
  return 'url' in node
}
