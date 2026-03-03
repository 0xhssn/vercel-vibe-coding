import React from 'react'
import { render } from '@testing-library/react'
import { CreateSandbox } from '../create-sandbox'
import type { DataPart } from '@/ai/messages/data-parts'

describe('CreateSandbox Message Part Component', () => {
  it('renders with loading status', () => {
    const message: DataPart['create-sandbox'] = {
      status: 'loading',
    }

    const { container } = render(<CreateSandbox message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with done status', () => {
    const message: DataPart['create-sandbox'] = {
      status: 'done',
      sandboxId: 'sandbox-123',
    }

    const { container } = render(<CreateSandbox message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with error status', () => {
    const message: DataPart['create-sandbox'] = {
      status: 'error',
      error: {
        message: 'Failed to create sandbox',
      },
    }

    const { container } = render(<CreateSandbox message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with done status and sandboxId', () => {
    const message: DataPart['create-sandbox'] = {
      status: 'done',
      sandboxId: 'sandbox-abc-def-123',
    }

    const { container } = render(<CreateSandbox message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with error status and error message', () => {
    const message: DataPart['create-sandbox'] = {
      status: 'error',
      error: {
        message: 'Insufficient resources to create sandbox',
      },
    }

    const { container } = render(<CreateSandbox message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with loading status without sandboxId', () => {
    const message: DataPart['create-sandbox'] = {
      status: 'loading',
      sandboxId: undefined,
    }

    const { container } = render(<CreateSandbox message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('displays correct status text for loading', () => {
    const message: DataPart['create-sandbox'] = {
      status: 'loading',
    }

    const { getByText } = render(<CreateSandbox message={message} />)
    expect(getByText('Creating Sandbox')).toBeInTheDocument()
  })

  it('displays correct status text for done', () => {
    const message: DataPart['create-sandbox'] = {
      status: 'done',
      sandboxId: 'sandbox-123',
    }

    const { getByText } = render(<CreateSandbox message={message} />)
    expect(getByText('Sandbox created successfully')).toBeInTheDocument()
  })

  it('displays correct status text for error', () => {
    const message: DataPart['create-sandbox'] = {
      status: 'error',
    }

    const { getByText } = render(<CreateSandbox message={message} />)
    expect(getByText('Failed to create sandbox')).toBeInTheDocument()
  })
})
