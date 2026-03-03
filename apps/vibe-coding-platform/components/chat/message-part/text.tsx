import type { TextUIPart } from 'ai'
import { MarkdownRenderer } from '@/components/markdown-renderer/markdown-renderer'
import { Skeleton } from '@/components/ui/skeleton'

export function Text({ part }: { part: TextUIPart }) {
  // Show skeleton if text is empty (streaming hasn't started yet)
  if (!part.text || part.text.trim().length === 0) {
    return (
      <div className="text-sm px-3.5 py-3 border bg-secondary/90 text-secondary-foreground border-gray-300 rounded-md font-mono">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="text-sm px-3.5 py-3 border bg-secondary/90 text-secondary-foreground border-gray-300 rounded-md font-mono">
      <MarkdownRenderer content={part.text} />
    </div>
  )
}
