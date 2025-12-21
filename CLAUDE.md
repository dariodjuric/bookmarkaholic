# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start Vite dev server with HMR
pnpm build    # TypeScript check + Vite production build
pnpm preview  # Preview production build
pnpm lint     # Run ESLint
pnpm format   # Format code with Prettier
```

## Architecture

This is a Chrome Extension bookmark manager built with Vite, React 18, Tailwind CSS 4, and shadcn/ui components. Uses the `@crxjs/vite-plugin` for Chrome extension bundling.

### Key Files

- `manifest.json` - Chrome Extension manifest v3 configuration
- `src/types/bookmark.ts` - Core `Bookmark` interface (id, title, url, isFolder, children, parentId)
- `src/components/bookmark-tree/main-page.tsx` - Main page with state management and CRUD operations
- `src/components/bookmark-tree/bookmark-tree.tsx` - Tree container that renders nodes
- `src/components/bookmark-tree/bookmark-node.tsx` - Individual bookmark component
- `src/components/bookmark-tree/folder-node.tsx` - Folder component with expansion and children
- `src/lib/chrome-bookmarks.ts` - Chrome Bookmarks API wrapper (fetch, create, update, delete, move, sort)
- `src/components/ui/` - shadcn/ui component library
- `src/background.ts` - Extension service worker

### Chrome Bookmarks API

The extension uses the Chrome Bookmarks API directly via `src/lib/chrome-bookmarks.ts`:

- `fetchBookmarks()` - Get all bookmarks from Chrome
- `createBookmark()`, `updateBookmark()`, `deleteBookmark()`, `moveBookmark()` - CRUD operations
- `sortFolderByName()` - Sort folder contents alphabetically
- `isRootFolder()` - Check for protected root folders (IDs 0-3)

### Styling

Uses Tailwind CSS 4 with PostCSS. The `cn()` utility in `src/lib/utils.ts` combines clsx and tailwind-merge for conditional class names.

## Notes

- Uses pnpm as package manager
- Path alias `@` maps to `./src`
- Build output goes to `dist/` folder
- Load unpacked extension from `dist/` in Chrome for testing

## Code Style

- Use default exports for React components, not named exports
- Do not use barrel exports (index.ts files that re-export from other files)
