/**
 * TypeScript types for Trigger.dev sandbox operations.
 */

// ============================================================================
// Sandbox Types
// ============================================================================

export interface SandboxConfig {
  timeout?: number // milliseconds
  ports?: number[]
  metadata?: Record<string, unknown>
}

export interface SandboxInfo {
  sandboxId: string
  status: 'creating' | 'running' | 'stopped' | 'error'
  ports?: number[]
  error?: string
}

// ============================================================================
// Command Types
// ============================================================================

export interface CommandConfig {
  command: string
  args?: string[]
  sudo?: boolean
  wait?: boolean
  cwd?: string
  env?: Record<string, string>
  commandId?: string // Pre-generated command ID for log streaming
}

export interface CommandResult {
  commandId: string
  status: 'pending' | 'executing' | 'running' | 'completed' | 'failed'
  exitCode?: number
  stdout?: string
  stderr?: string
  error?: string
}

// ============================================================================
// File Types
// ============================================================================

export interface FileUpload {
  path: string
  content: string | Buffer
}

export interface FileReadResult {
  success: boolean
  content?: string
  error?: string
}

// ============================================================================
// Preview Types
// ============================================================================

export interface PreviewURLResult {
  success: boolean
  url?: string
  error?: string
}

// ============================================================================
// Log Types
// ============================================================================

export interface LogLine {
  stream: 'stdout' | 'stderr'
  data: string
  timestamp: number
}

// ============================================================================
// Operation Results
// ============================================================================

export interface OperationResult {
  success: boolean
  error?: string
}

export interface UploadResult extends OperationResult {
  uploaded?: string[]
}

// ============================================================================
// Handler Payloads
// ============================================================================

export interface RunCommandPayload {
  sandboxId: string
  command: CommandConfig
}

export interface UploadFilesPayload {
  sandboxId: string
  files: FileUpload[]
}

export interface GetPreviewURLPayload {
  sandboxId: string
  port: number
}

export interface ReadFilePayload {
  sandboxId: string
  path: string
}

export interface StopSandboxPayload {
  sandboxId: string
}
