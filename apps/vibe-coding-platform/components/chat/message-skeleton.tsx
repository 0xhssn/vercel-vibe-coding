import { BotIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface MessageSkeletonProps {
  className?: string
  showToolSkeleton?: boolean
}

export function MessageSkeleton({
  className,
  showToolSkeleton = false,
}: MessageSkeletonProps) {
  return (
    <div className={cn('mr-20', className)}>
      {/* Message Header Skeleton */}
      <div className="flex items-center gap-2 text-sm font-medium font-mono text-primary mb-1.5">
        <BotIcon className="w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Message Content Skeleton */}
      <div className="space-y-1.5">
        {/* Text content skeleton */}
        <div className="text-sm px-3.5 py-3 border bg-secondary/90 border-gray-300 rounded-md font-mono">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>

        {/* Optional tool execution skeleton */}
        {showToolSkeleton && (
          <div className="text-sm px-3.5 py-3 border border-border bg-background rounded-md font-mono">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ToolExecutionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'text-sm px-3.5 py-3 border border-border bg-background rounded-md font-mono',
        className,
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}
