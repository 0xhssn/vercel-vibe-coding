import React from 'react'
import { render } from '@testing-library/react'
import { RunCommand } from '../run-command'
import type { DataPart } from '@/ai/messages/data-parts'

describe('RunCommand Message Part Component', () => {
  it('renders command with executing status', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      command: 'npm',
      args: ['install'],
      status: 'executing',
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders command with waiting status', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      command: 'npm',
      args: ['run', 'build'],
      status: 'waiting',
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders command with running status', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      command: 'npm',
      args: ['start'],
      status: 'running',
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders command with done status and success exit code', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      command: 'npm',
      args: ['test'],
      status: 'done',
      exitCode: 0,
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders command with done status and error exit code', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      command: 'npm',
      args: ['test'],
      status: 'done',
      exitCode: 1,
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders command with error status', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      command: 'npm',
      args: ['invalid'],
      status: 'error',
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders command with multiple arguments', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      command: 'docker',
      args: ['run', '-it', '--rm', 'ubuntu:latest', 'bash'],
      status: 'done',
      exitCode: 0,
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders command with no arguments', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      command: 'ls',
      args: [],
      status: 'done',
      exitCode: 0,
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders command with commandId', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      commandId: 'cmd-456',
      command: 'npm',
      args: ['install'],
      status: 'done',
      exitCode: 0,
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders command with error object', () => {
    const message: DataPart['run-command'] = {
      sandboxId: 'sandbox-123',
      command: 'npm',
      args: ['install'],
      status: 'error',
      error: {
        message: 'Command failed',
      },
    }

    const { container } = render(<RunCommand message={message} />)
    expect(container).toMatchSnapshot()
  })
})
