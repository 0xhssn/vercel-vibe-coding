/**
 * E2B Logger - Consistent logging for E2B operations.
 */

type LogLevel = 'info' | 'warn' | 'error'

class E2BLogger {
  private formatData(data: Record<string, unknown>): string {
    return Object.entries(data)
      .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
      .join(' ')
  }

  log(
    level: LogLevel,
    module: string,
    message: string,
    data?: Record<string, unknown>
  ): void {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [E2B.${module}]`

    if (data) {
      console[level](`${prefix} ${message} | ${this.formatData(data)}`)
    } else {
      console[level](`${prefix} ${message}`)
    }
  }

  info(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('info', module, message, data)
  }

  warn(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('warn', module, message, data)
  }

  error(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('error', module, message, data)
  }
}

export const logger = new E2BLogger()
