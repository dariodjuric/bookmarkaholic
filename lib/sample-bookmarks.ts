import type { Bookmark } from "@/types/bookmark"

export const sampleBookmarks: Bookmark[] = [
  {
    id: "1",
    title: "Work",
    isFolder: true,
    parentId: null,
    children: [
      {
        id: "1-1",
        title: "GitHub",
        url: "https://github.com",
        isFolder: false,
        parentId: "1",
      },
      {
        id: "1-2",
        title: "Vercel",
        url: "https://vercel.com",
        isFolder: false,
        parentId: "1",
      },
      {
        id: "1-3",
        title: "Documentation",
        isFolder: true,
        parentId: "1",
        children: [
          {
            id: "1-3-1",
            title: "Next.js Docs",
            url: "https://nextjs.org/docs",
            isFolder: false,
            parentId: "1-3",
          },
          {
            id: "1-3-2",
            title: "React Docs",
            url: "https://react.dev",
            isFolder: false,
            parentId: "1-3",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Entertainment",
    isFolder: true,
    parentId: null,
    children: [
      {
        id: "2-1",
        title: "YouTube",
        url: "https://youtube.com",
        isFolder: false,
        parentId: "2",
      },
      {
        id: "2-2",
        title: "Netflix",
        url: "https://netflix.com",
        isFolder: false,
        parentId: "2",
      },
      {
        id: "2-3",
        title: "Spotify",
        url: "https://spotify.com",
        isFolder: false,
        parentId: "2",
      },
    ],
  },
  {
    id: "3",
    title: "Shopping",
    isFolder: true,
    parentId: null,
    children: [
      {
        id: "3-1",
        title: "Amazon",
        url: "https://amazon.com",
        isFolder: false,
        parentId: "3",
      },
      {
        id: "3-2",
        title: "eBay",
        url: "https://ebay.com",
        isFolder: false,
        parentId: "3",
      },
    ],
  },
  {
    id: "4",
    title: "Google",
    url: "https://google.com",
    isFolder: false,
    parentId: null,
  },
]
