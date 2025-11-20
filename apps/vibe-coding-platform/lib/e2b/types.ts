/**
 * E2B-specific TypeScript types.
 */

import type { Sandbox } from 'e2b'

// ============================================================================
// Configuration Types
// ============================================================================

export interface E2BConfig {
  apiKey: string
  timeoutMs?: number
  metadata?: Record<string, string>
}

export interface ConnectionOptions {
  apiKey: string
}

// ============================================================================
// Timeout Constants
// ============================================================================

export const TIMEOUT = {
  DEV_SERVER: 300000, // 5 minutes
  INSTALL: 300000, // 5 minutes
  DEFAULT: 120000, // 2 minutes
  SANDBOX: 600000, // 10 minutes
  PNPM_INSTALL: 60000, // 1 minute for global pnpm install
} as const

// ============================================================================
// Command Types
// ============================================================================

export interface CommandOptions {
  onStdout?: (data: string) => void
  onStderr?: (data: string) => void
  timeoutMs?: number
  background?: boolean
  cwd?: string
  env?: Record<string, string>
}

export interface CommandOutput {
  exitCode: number | undefined
  stdout: string
  stderr: string
}

// ============================================================================
// Sandbox Instance Type
// ============================================================================

export type SandboxInstance = Sandbox
