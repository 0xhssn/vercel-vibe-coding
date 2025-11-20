/**
 * E2B Files - File operation utilities for E2B sandboxes.
 */

import type { SandboxInstance } from './types'
import { logger } from './logger'

export interface FileUpload {
  path: string
  content: string | Buffer
}

/**
 * Write a file to the sandbox
 */
export async function writeFile(
  sandbox: SandboxInstance,
  path: string,
  content: string
): Promise<void> {
  await sandbox.files.write(path, content)
}

/**
 * Read a file from the sandbox
 */
export async function readFile(
  sandbox: SandboxInstance,
  path: string
): Promise<string> {
  return sandbox.files.read(path)
}

/**
 * Upload multiple files to the sandbox
 */
export async function uploadFiles(
  sandbox: SandboxInstance,
  files: FileUpload[]
): Promise<string[]> {
  const uploadedPaths: string[] = []

  logger.info('files', 'Uploading files', { count: files.length })

  for (const file of files) {
    const content =
      typeof file.content === 'string'
        ? file.content
        : file.content.toString('utf-8')

    await sandbox.files.write(file.path, content)
    uploadedPaths.push(file.path)
  }

  logger.info('files', 'Files uploaded', { paths: uploadedPaths })

  return uploadedPaths
}

/**
 * Check if a file exists in the sandbox
 */
export async function fileExists(
  sandbox: SandboxInstance,
  path: string
): Promise<boolean> {
  try {
    await sandbox.files.read(path)
    return true
  } catch {
    return false
  }
}

/**
 * List files in a directory
 */
export async function listFiles(
  sandbox: SandboxInstance,
  path: string
): Promise<string[]> {
  const result = await sandbox.commands.run(`ls -1 ${path}`)
  if (result.exitCode !== 0) {
    return []
  }
  return result.stdout.split('\n').filter(Boolean)
}
