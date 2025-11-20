/**
 * E2B Client - Connection and lifecycle management for E2B sandboxes.
 */

import { Sandbox } from 'e2b'
import type { E2BConfig, ConnectionOptions, SandboxInstance } from './types'
import { TIMEOUT } from './types'
import { logger } from './logger'

export class E2BClient {
  private activeSandboxes = new Map<string, SandboxInstance>()

  /**
   * Get API key from environment
   */
  getApiKey(): string {
    const apiKey = process.env.E2B_API_KEY
    if (!apiKey) {
      throw new Error('E2B_API_KEY environment variable is not set')
    }
    return apiKey
  }

  /**
   * Create a new sandbox
   */
  async create(config: E2BConfig): Promise<SandboxInstance> {
    logger.info('client', 'Creating new sandbox', {
      timeoutMs: config.timeoutMs || TIMEOUT.SANDBOX,
    })

    const sandbox = await Sandbox.create({
      apiKey: config.apiKey,
      timeoutMs: config.timeoutMs || TIMEOUT.SANDBOX,
      metadata: config.metadata,
    })

    this.activeSandboxes.set(sandbox.sandboxId, sandbox)
    logger.info('client', 'Sandbox created', { sandboxId: sandbox.sandboxId })

    return sandbox
  }

  /**
   * Connect to an existing sandbox
   */
  async connect(
    sandboxId: string,
    options: ConnectionOptions
  ): Promise<SandboxInstance> {
    logger.info('client', 'Connecting to sandbox', { sandboxId })

    const sandbox = await Sandbox.connect(sandboxId, { apiKey: options.apiKey })
    this.activeSandboxes.set(sandboxId, sandbox)

    logger.info('client', 'Connected to sandbox', { sandboxId })
    return sandbox
  }

  /**
   * Get a sandbox from cache or connect to it
   */
  async getOrConnect(sandboxId: string): Promise<SandboxInstance> {
    const apiKey = this.getApiKey()
    let sandbox = this.activeSandboxes.get(sandboxId)

    if (sandbox) {
      // Verify sandbox is still alive with health check
      try {
        sandbox.getHost(3000)
        return sandbox
      } catch {
        logger.warn('client', 'Sandbox reference is stale, reconnecting', {
          sandboxId,
        })
        this.activeSandboxes.delete(sandboxId)
      }
    }

    return this.connect(sandboxId, { apiKey })
  }

  /**
   * Get a cached sandbox (without connecting)
   */
  get(sandboxId: string): SandboxInstance | undefined {
    return this.activeSandboxes.get(sandboxId)
  }

  /**
   * Store a sandbox in cache
   */
  set(sandboxId: string, sandbox: SandboxInstance): void {
    this.activeSandboxes.set(sandboxId, sandbox)
  }

  /**
   * Remove a sandbox from cache
   */
  delete(sandboxId: string): void {
    this.activeSandboxes.delete(sandboxId)
  }

  /**
   * Kill a sandbox and remove from cache
   */
  async kill(sandboxId: string): Promise<void> {
    const sandbox = this.activeSandboxes.get(sandboxId)

    if (sandbox) {
      await sandbox.kill()
      this.activeSandboxes.delete(sandboxId)
      logger.info('client', 'Sandbox killed', { sandboxId })
    }
  }

  /**
   * Get the host URL for a port
   */
  getHost(sandbox: SandboxInstance, port: number): string {
    return sandbox.getHost(port)
  }
}

// Export singleton instance
export const e2bClient = new E2BClient()
