import React from 'react'
import { render } from '@testing-library/react'
import { Message } from '../message'
import type { ChatUIMessage } from '../types'

describe('Message Component', () => {
  it('renders user message correctly', () => {
    const message: ChatUIMessage = {
      id: '1',
      role: 'user',
      content: 'Hello, assistant!',
      parts: [
        {
          type: 'text',
          text: 'Hello, assistant!',
        },
      ],
    }

    const { container } = render(<Message message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders assistant message with model metadata', () => {
    const message: ChatUIMessage = {
      id: '2',
      role: 'assistant',
      content: 'Hi there!',
      parts: [
        {
          type: 'text',
          text: 'Hi there!',
        },
      ],
      metadata: {
        model: 'gpt-4',
      },
    }

    const { container } = render(<Message message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders message with multiple text parts', () => {
    const message: ChatUIMessage = {
      id: '3',
      role: 'assistant',
      content: 'Part 1\nPart 2',
      parts: [
        {
          type: 'text',
          text: 'Part 1',
        },
        {
          type: 'text',
          text: 'Part 2',
        },
      ],
      metadata: {
        model: 'gpt-4',
      },
    }

    const { container } = render(<Message message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders message with reasoning part', () => {
    const message: ChatUIMessage = {
      id: '4',
      role: 'assistant',
      content: 'Thinking...\nResult',
      parts: [
        {
          type: 'reasoning',
          text: 'Let me think about this step by step',
          state: 'done',
        },
        {
          type: 'text',
          text: 'Result',
        },
      ],
      metadata: {
        model: 'gpt-4',
      },
    }

    const { container } = render(<Message message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders message with streaming reasoning part', () => {
    const message: ChatUIMessage = {
      id: '5',
      role: 'assistant',
      content: 'Thinking...',
      parts: [
        {
          type: 'reasoning',
          text: 'Processing...',
          state: 'streaming',
        },
      ],
      metadata: {
        model: 'gpt-4',
      },
    }

    const { container } = render(<Message message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders message with empty reasoning part', () => {
    const message: ChatUIMessage = {
      id: '6',
      role: 'assistant',
      content: 'Result',
      parts: [
        {
          type: 'reasoning',
          text: '',
          state: 'done',
        },
        {
          type: 'text',
          text: 'Result',
        },
      ],
      metadata: {
        model: 'gpt-4',
      },
    }

    const { container } = render(<Message message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders user message with correct styling', () => {
    const message: ChatUIMessage = {
      id: '7',
      role: 'user',
      content: 'User query',
      parts: [
        {
          type: 'text',
          text: 'User query',
        },
      ],
    }

    const { container } = render(<Message message={message} />)
    const wrapper = container.querySelector('div')
    expect(wrapper).toHaveClass('ml-20')
    expect(container).toMatchSnapshot()
  })

  it('renders assistant message with correct styling', () => {
    const message: ChatUIMessage = {
      id: '8',
      role: 'assistant',
      content: 'Assistant response',
      parts: [
        {
          type: 'text',
          text: 'Assistant response',
        },
      ],
      metadata: {
        model: 'gpt-4',
      },
    }

    const { container } = render(<Message message={message} />)
    const wrapper = container.querySelector('div')
    expect(wrapper).toHaveClass('mr-20')
    expect(container).toMatchSnapshot()
  })
})
