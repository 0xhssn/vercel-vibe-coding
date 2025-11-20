/**
 * Trigger.dev module exports.
 *
 * This is the main entry point for all Trigger.dev sandbox functionality.
 */

// Types
export type {
  SandboxConfig,
  SandboxInfo,
  CommandConfig,
  CommandResult,
  FileUpload,
  FileReadResult,
  PreviewURLResult,
  OperationResult,
  UploadResult,
  LogLine,
  RunCommandPayload,
  UploadFilesPayload,
  GetPreviewURLPayload,
  ReadFilePayload,
  StopSandboxPayload,
} from './types'

// Sandbox Manager
export { SandboxManager, sandboxManager } from './sandbox-manager'

// Tasks
export {
  createSandboxTask,
  runCommandTask,
  uploadFilesTask,
  getPreviewURLTask,
  readFileTask,
  stopSandboxTask,
} from './tasks'

// Client utilities
export { isTriggerConfigured, getTriggerConfig } from './client'
