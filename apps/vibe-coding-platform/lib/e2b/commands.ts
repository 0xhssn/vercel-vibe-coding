/**
 * E2B Commands - Command execution utilities for E2B sandboxes.
 */

import type { SandboxInstance, CommandOptions, CommandOutput } from './types'
import { TIMEOUT } from './types'
import { logger } from './logger'

/**
 * Check if pnpm is installed in the sandbox
 */
export async function isPnpmInstalled(
  sandbox: SandboxInstance
): Promise<boolean> {
  try {
    const result = await sandbox.commands.run('which pnpm')
    return result.exitCode === 0
  } catch {
    return false
  }
}

/**
 * Install pnpm globally in the sandbox
 */
export async function installPnpm(sandbox: SandboxInstance): Promise<boolean> {
  logger.info('commands', 'Installing pnpm globally')

  try {
    const result = await sandbox.commands.run('npm install -g pnpm@latest', {
      timeoutMs: TIMEOUT.PNPM_INSTALL,
    })

    if (result.exitCode === 0) {
      logger.info('commands', 'pnpm installed successfully')
      return true
    } else {
      logger.error('commands', 'Failed to install pnpm', {
        stderr: result.stderr,
      })
      return false
    }
  } catch (error) {
    logger.error('commands', 'Error installing pnpm', {
      error: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}

/**
 * Ensure pnpm is available in the sandbox
 */
export async function ensurePnpm(sandbox: SandboxInstance): Promise<void> {
  logger.info('commands', 'Checking if pnpm is installed')

  const installed = await isPnpmInstalled(sandbox)

  if (!installed) {
    await installPnpm(sandbox)
  } else {
    logger.info('commands', 'pnpm is already installed')
  }
}

/**
 * Run a command in the sandbox
 */
export async function runCommand(
  sandbox: SandboxInstance,
  command: string,
  options: CommandOptions = {}
): Promise<CommandOutput> {
  logger.info('commands', `Executing: ${command}`)

  const result = await sandbox.commands.run(command, {
    onStdout: options.onStdout,
    onStderr: options.onStderr,
    timeoutMs: options.timeoutMs || TIMEOUT.DEFAULT,
    background: options.background,
  })

  return {
    exitCode: result.exitCode,
    stdout: result.stdout,
    stderr: result.stderr,
  }
}

/**
 * Determine if a command is a dev server command
 */
export function isDevServerCommand(
  command: string,
  args: string[] = []
): boolean {
  const packageManagers = ['pnpm', 'npm', 'yarn']
  const devArgs = ['dev', 'start']

  return (
    packageManagers.some((pm) => command === pm) &&
    args.some((arg) => devArgs.includes(arg) || arg.includes('dev'))
  )
}

/**
 * Determine if a command is an install command
 */
export function isInstallCommand(
  command: string,
  args: string[] = []
): boolean {
  const packageManagers = ['pnpm', 'npm', 'yarn']
  const installArgs = ['install', 'i', 'add']

  return (
    packageManagers.some((pm) => command === pm) &&
    args.some((arg) => installArgs.includes(arg))
  )
}

/**
 * Get the appropriate timeout for a command
 */
export function getCommandTimeout(
  command: string,
  args: string[] = []
): number {
  if (isDevServerCommand(command, args)) {
    return TIMEOUT.DEV_SERVER
  }
  if (isInstallCommand(command, args)) {
    return TIMEOUT.INSTALL
  }
  return TIMEOUT.DEFAULT
}
