/**
 * SandboxManager - Centralized class for managing E2B sandbox instances.
 *
 * This class handles:
 * - Sandbox lifecycle (create, connect, stop)
 * - Command execution with proper timeouts
 * - File operations
 * - Preview URL generation
 */

import {
  e2bClient,
  logger,
  ensurePnpm,
  runCommand as e2bRunCommand,
  uploadFiles as e2bUploadFiles,
  readFile as e2bReadFile,
  getCommandTimeout,
  isDevServerCommand,
  isInstallCommand,
  TIMEOUT,
} from '@/lib/e2b'
import type {
  SandboxConfig,
  SandboxInfo,
  CommandConfig,
  CommandResult,
  FileUpload,
  UploadResult,
  PreviewURLResult,
  FileReadResult,
  OperationResult,
} from './types'
import {
  initCommandLogs,
  appendLog,
  completeCommand,
  failCommand,
} from '@/lib/log-store'

export class SandboxManager {
  private static instance: SandboxManager

  private constructor() {}

  static getInstance(): SandboxManager {
    if (!SandboxManager.instance) {
      SandboxManager.instance = new SandboxManager()
    }
    return SandboxManager.instance
  }

  /**
   * Create a new sandbox
   */
  async create(config: SandboxConfig): Promise<SandboxInfo> {
    try {
      const apiKey = e2bClient.getApiKey()

      const sandbox = await e2bClient.create({
        apiKey,
        timeoutMs: config.timeout || TIMEOUT.SANDBOX,
        metadata: config.metadata as Record<string, string> | undefined,
      })

      return {
        sandboxId: sandbox.sandboxId,
        status: 'running',
        ports: config.ports,
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error('SandboxManager', 'Failed to create sandbox', {
        error: errorMsg,
      })

      return {
        sandboxId: '',
        status: 'error',
        error: errorMsg,
      }
    }
  }

  /**
   * Run a command in a sandbox
   */
  async runCommand(
    sandboxId: string,
    command: CommandConfig
  ): Promise<CommandResult> {
    const commandId =
      command.commandId ||
      `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    logger.info('SandboxManager', 'Starting command execution', {
      sandboxId,
      command: command.command,
      args: command.args,
      commandId,
    })

    try {
      const sandbox = await e2bClient.getOrConnect(sandboxId)

      // Auto-install pnpm if needed
      if (command.command === 'pnpm') {
        await ensurePnpm(sandbox)
      }

      const cmd = `${command.command} ${(command.args || []).join(' ')}`

      // Initialize log storage
      initCommandLogs(commandId)
      appendLog(commandId, 'info', `Running: ${cmd}`)

      // Determine command type and timeout
      const isDevServer = isDevServerCommand(command.command, command.args)
      const isInstall = isInstallCommand(command.command, command.args)
      const timeoutMs = getCommandTimeout(command.command, command.args)

      if (isDevServer) {
        logger.info(
          'SandboxManager',
          'Dev server command detected, using background mode'
        )
      }
      if (isInstall) {
        logger.info('SandboxManager', 'Install command detected', { timeoutMs })
      }

      const result = await e2bRunCommand(sandbox, cmd, {
        onStdout: (data) => {
          const preview =
            data.length > 200 ? `${data.substring(0, 200)}...` : data
          logger.info('SandboxManager', `stdout: ${preview}`)
          appendLog(commandId, 'stdout', data)
        },
        onStderr: (data) => {
          const preview =
            data.length > 200 ? `${data.substring(0, 200)}...` : data
          logger.info('SandboxManager', `stderr: ${preview}`)
          appendLog(commandId, 'stderr', data)
        },
        timeoutMs,
        background: isDevServer && !command.wait,
      })

      logger.info('SandboxManager', 'Command completed', {
        commandId,
        exitCode: result.exitCode,
      })

      completeCommand(commandId, result.exitCode ?? 0)

      if (command.wait) {
        return {
          commandId,
          status: 'completed',
          exitCode: result.exitCode,
          stdout: result.stdout,
          stderr: result.stderr,
        }
      }

      return {
        commandId,
        status: 'running',
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error('SandboxManager', 'Command failed', {
        commandId,
        error: errorMsg,
      })

      failCommand(commandId, errorMsg)

      return {
        commandId,
        status: 'failed',
        error: errorMsg,
      }
    }
  }

  /**
   * Upload files to a sandbox
   */
  async uploadFiles(
    sandboxId: string,
    files: FileUpload[]
  ): Promise<UploadResult> {
    try {
      const sandbox = await e2bClient.getOrConnect(sandboxId)
      const uploadedPaths = await e2bUploadFiles(sandbox, files)

      return {
        success: true,
        uploaded: uploadedPaths,
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error('SandboxManager', 'Failed to upload files', {
        error: errorMsg,
      })

      return {
        success: false,
        error: errorMsg,
      }
    }
  }

  /**
   * Get preview URL for a sandbox port
   */
  async getPreviewURL(
    sandboxId: string,
    port: number
  ): Promise<PreviewURLResult> {
    logger.info('SandboxManager', 'Getting preview URL', { sandboxId, port })

    try {
      const sandbox = await e2bClient.getOrConnect(sandboxId)
      const host = e2bClient.getHost(sandbox, port)
      const url = `https://${host}`

      logger.info('SandboxManager', 'Generated URL', { url })

      return {
        success: true,
        url,
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error('SandboxManager', 'Failed to get preview URL', {
        sandboxId,
        port,
        error: errorMsg,
      })

      return {
        success: false,
        error: errorMsg,
      }
    }
  }

  /**
   * Read a file from a sandbox
   */
  async readFile(sandboxId: string, path: string): Promise<FileReadResult> {
    try {
      const sandbox = await e2bClient.getOrConnect(sandboxId)
      const content = await e2bReadFile(sandbox, path)

      return {
        success: true,
        content,
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error('SandboxManager', 'Failed to read file', {
        sandboxId,
        path,
        error: errorMsg,
      })

      return {
        success: false,
        error: errorMsg,
      }
    }
  }

  /**
   * Stop/destroy a sandbox
   */
  async stop(sandboxId: string): Promise<OperationResult> {
    try {
      await e2bClient.kill(sandboxId)
      return { success: true }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error('SandboxManager', 'Failed to stop sandbox', {
        sandboxId,
        error: errorMsg,
      })

      return {
        success: false,
        error: errorMsg,
      }
    }
  }
}

// Export singleton instance
export const sandboxManager = SandboxManager.getInstance()
