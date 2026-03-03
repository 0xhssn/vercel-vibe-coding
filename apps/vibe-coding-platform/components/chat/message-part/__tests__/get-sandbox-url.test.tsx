import React from 'react'
import { render } from '@testing-library/react'
import { GetSandboxURL } from '../get-sandbox-url'
import type { DataPart } from '@/ai/messages/data-parts'

describe('GetSandboxURL Message Part Component', () => {
  it('renders with loading status', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'loading',
    }

    const { container } = render(<GetSandboxURL message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with done status and URL', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'done',
      url: 'https://sandbox.example.com/abc123',
    }

    const { container } = render(<GetSandboxURL message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with error status', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'error',
      error: 'Failed to get sandbox URL',
    }

    const { container } = render(<GetSandboxURL message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with done status without URL', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'done',
    }

    const { container } = render(<GetSandboxURL message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders link with correct href', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'done',
      url: 'https://sandbox.example.com/test123',
    }

    const { getByRole } = render(<GetSandboxURL message={message} />)
    const link = getByRole('link')
    expect(link).toHaveAttribute('href', 'https://sandbox.example.com/test123')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders loading text when status is loading', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'loading',
    }

    const { getByText } = render(<GetSandboxURL message={message} />)
    expect(getByText('Getting Sandbox URL')).toBeInTheDocument()
  })

  it('renders URL text when URL is available', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'done',
      url: 'https://sandbox.example.com/xyz789',
    }

    const { getByText } = render(<GetSandboxURL message={message} />)
    expect(getByText('https://sandbox.example.com/xyz789')).toBeInTheDocument()
  })

  it('renders with long URL', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'done',
      url: 'https://sandbox.example.com/very/long/path/with/many/segments/and/parameters?key=value&other=param',
    }

    const { container } = render(<GetSandboxURL message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with localhost URL', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'done',
      url: 'http://localhost:3000',
    }

    const { container } = render(<GetSandboxURL message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with IP address URL', () => {
    const message: DataPart['get-sandbox-url'] = {
      status: 'done',
      url: 'http://192.168.1.100:8080',
    }

    const { container } = render(<GetSandboxURL message={message} />)
    expect(container).toMatchSnapshot()
  })
})
