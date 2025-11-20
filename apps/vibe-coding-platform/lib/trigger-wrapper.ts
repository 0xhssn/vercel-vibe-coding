/**
 * High-level wrapper functions for Trigger.dev + E2B sandbox operations.
 *
 * These functions provide a clean API for the AI tools to interact with sandboxes.
 * In development, operations run locally via SandboxManager.
 * In production, they run via Trigger.dev tasks.
 */

import { tasks } from '@trigger.dev/sdk/v3'
import {
  sandboxManager,
  type SandboxConfig,
  type SandboxInfo,
  type CommandConfig,
  type CommandResult,
  type FileUpload,
  type UploadResult,
  type PreviewURLResult,
  type FileReadResult,
  type OperationResult,
} from '@/trigger'

const isDev =
  process.env.NODE_ENV === 'development' || !process.env.TRIGGER_SECRET_KEY

/**
 * Create a new sandbox
 */
export async function createSandbox(
  config: SandboxConfig
): Promise<SandboxInfo> {
  try {
    if (isDev) {
      return await sandboxManager.create(config)
    }

    const handle = await tasks.trigger('create-sandbox', config)
    return handle as unknown as SandboxInfo
  } catch (error) {
    console.error('Failed to create sandbox:', error)
    return {
      sandboxId: '',
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Run a command in an existing sandbox
 */
export async function runCommand(
  sandboxId: string,
  command: CommandConfig
): Promise<CommandResult> {
  try {
    if (isDev) {
      return await sandboxManager.runCommand(sandboxId, command)
    }

    const handle = await tasks.trigger('run-command', { sandboxId, command })
    return handle as unknown as CommandResult
  } catch (error) {
    console.error('Failed to run command:', error)
    return {
      commandId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Upload files to a sandbox
 */
export async function uploadFiles(
  sandboxId: string,
  files: FileUpload[]
): Promise<UploadResult> {
  try {
    if (isDev) {
      return await sandboxManager.uploadFiles(sandboxId, files)
    }

    const handle = await tasks.trigger('upload-files', { sandboxId, files })
    return handle as unknown as UploadResult
  } catch (error) {
    console.error('Failed to upload files:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Get preview URL for a sandbox port
 */
export async function getPreviewURL(
  sandboxId: string,
  port: number
): Promise<PreviewURLResult> {
  try {
    if (isDev) {
      return await sandboxManager.getPreviewURL(sandboxId, port)
    }

    const handle = await tasks.trigger('get-preview-url', { sandboxId, port })
    return handle as unknown as PreviewURLResult
  } catch (error) {
    console.error('Failed to get preview URL:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Read a file from a sandbox
 */
export async function readFile(
  sandboxId: string,
  path: string
): Promise<FileReadResult> {
  try {
    if (isDev) {
      return await sandboxManager.readFile(sandboxId, path)
    }

    const handle = await tasks.trigger('read-file', { sandboxId, path })
    return handle as unknown as FileReadResult
  } catch (error) {
    console.error('Failed to read file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Stop a sandbox
 */
export async function stopSandbox(sandboxId: string): Promise<OperationResult> {
  try {
    if (isDev) {
      return await sandboxManager.stop(sandboxId)
    }

    const handle = await tasks.trigger('stop-sandbox', { sandboxId })
    return handle as unknown as OperationResult
  } catch (error) {
    console.error('Failed to stop sandbox:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
