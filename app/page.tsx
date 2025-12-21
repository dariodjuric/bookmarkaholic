import { BookmarkTree } from "@/components/bookmark-tree"
import { Bookmark } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Bookmark className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bookmarkaholic</h1>
            <p className="text-muted-foreground">Organize your bookmarks the way they should be</p>
          </div>
        </div>
        <BookmarkTree />
      </div>
    </main>
  )
}
