/**
 * Trigger.dev task definitions for sandbox operations.
 *
 * These tasks wrap the SandboxManager methods for use with Trigger.dev v3.
 */

import { task } from '@trigger.dev/sdk/v3'
import { sandboxManager } from './sandbox-manager'
import type {
  SandboxConfig,
  RunCommandPayload,
  UploadFilesPayload,
  GetPreviewURLPayload,
  ReadFilePayload,
  StopSandboxPayload,
} from './types'

/**
 * Task: Create a new sandbox
 */
export const createSandboxTask = task({
  id: 'create-sandbox',
  run: async (payload: SandboxConfig) => {
    return sandboxManager.create(payload)
  },
})

/**
 * Task: Run a command in a sandbox
 */
export const runCommandTask = task({
  id: 'run-command',
  run: async (payload: RunCommandPayload) => {
    return sandboxManager.runCommand(payload.sandboxId, payload.command)
  },
})

/**
 * Task: Upload files to a sandbox
 */
export const uploadFilesTask = task({
  id: 'upload-files',
  run: async (payload: UploadFilesPayload) => {
    return sandboxManager.uploadFiles(payload.sandboxId, payload.files)
  },
})

/**
 * Task: Get preview URL for a sandbox port
 */
export const getPreviewURLTask = task({
  id: 'get-preview-url',
  run: async (payload: GetPreviewURLPayload) => {
    return sandboxManager.getPreviewURL(payload.sandboxId, payload.port)
  },
})

/**
 * Task: Read a file from a sandbox
 */
export const readFileTask = task({
  id: 'read-file',
  run: async (payload: ReadFilePayload) => {
    return sandboxManager.readFile(payload.sandboxId, payload.path)
  },
})

/**
 * Task: Stop/destroy a sandbox
 */
export const stopSandboxTask = task({
  id: 'stop-sandbox',
  run: async (payload: StopSandboxPayload) => {
    return sandboxManager.stop(payload.sandboxId)
  },
})
