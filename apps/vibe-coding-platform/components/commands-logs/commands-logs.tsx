'use client'

import type { Command } from './types'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SquareChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface Props {
  className?: string
  commands: Command[]
}

export function CommandsLogs(props: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [props.commands])

  return (
    <Panel className={props.className}>
      <PanelHeader>
        <SquareChevronRight className="mr-2 w-4" />
        <span className="font-mono uppercase font-semibold">
          Sandbox Remote Output
        </span>
      </PanelHeader>
      <div className="h-[calc(100%-2rem)]">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-2">
            {props.commands.map((command) => {
              const date = new Date(command.startedAt).toLocaleTimeString(
                'en-US',
                {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }
              )

              const line = `${command.command} ${command.args.join(' ')}`
              const isRunning = command.exitCode === undefined
              const isSuccess = command.exitCode === 0
              const statusColor = isRunning
                ? 'text-yellow-500'
                : isSuccess
                ? 'text-green-500'
                : 'text-red-500'
              const statusText = isRunning
                ? '⏳ running'
                : isSuccess
                ? '✓ exit 0'
                : `✗ exit ${command.exitCode}`

              return (
                <div
                  key={command.cmdId}
                  className="border-b border-border/50 pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground text-xs">
                      {date}
                    </span>
                    <span className={`text-xs ${statusColor}`}>
                      {statusText}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-blue-400 mb-1">
                    $ {line}
                  </pre>
                  {command.logs?.map((log, i) => (
                    <pre
                      key={i}
                      className={`whitespace-pre-wrap font-mono text-xs ${
                        log.stream === 'stderr'
                          ? 'text-red-400'
                          : 'text-foreground/80'
                      }`}
                    >
                      {log.data}
                    </pre>
                  ))}
                </div>
              )
            })}
          </div>
          <div ref={bottomRef} />
        </ScrollArea>
      </div>
    </Panel>
  )
}
