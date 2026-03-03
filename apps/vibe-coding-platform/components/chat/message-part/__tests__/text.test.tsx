import React from 'react'
import { render } from '@testing-library/react'
import { Text } from '../text'
import type { TextUIPart } from 'ai'

describe('Text Message Part Component', () => {
  it('renders simple text content', () => {
    const part: TextUIPart = {
      type: 'text',
      text: 'Hello, world!',
    }

    const { container } = render(<Text part={part} />)
    expect(container).toMatchSnapshot()
  })

  it('renders markdown formatted text', () => {
    const part: TextUIPart = {
      type: 'text',
      text: '# Heading\n\n**Bold text** and *italic text*',
    }

    const { container } = render(<Text part={part} />)
    expect(container).toMatchSnapshot()
  })

  it('renders code blocks in text', () => {
    const part: TextUIPart = {
      type: 'text',
      text: 'Here is some code:\n\n```javascript\nconst x = 42;\n```',
    }

    const { container } = render(<Text part={part} />)
    expect(container).toMatchSnapshot()
  })

  it('renders multiline text', () => {
    const part: TextUIPart = {
      type: 'text',
      text: 'Line 1\nLine 2\nLine 3',
    }

    const { container } = render(<Text part={part} />)
    expect(container).toMatchSnapshot()
  })

  it('renders text with links', () => {
    const part: TextUIPart = {
      type: 'text',
      text: 'Check out [this link](https://example.com)',
    }

    const { container } = render(<Text part={part} />)
    expect(container).toMatchSnapshot()
  })

  it('renders empty text', () => {
    const part: TextUIPart = {
      type: 'text',
      text: '',
    }

    const { container } = render(<Text part={part} />)
    expect(container).toMatchSnapshot()
  })

  it('renders text with special characters', () => {
    const part: TextUIPart = {
      type: 'text',
      text: 'Special chars: <>&"\'',
    }

    const { container } = render(<Text part={part} />)
    expect(container).toMatchSnapshot()
  })

  it('renders text with lists', () => {
    const part: TextUIPart = {
      type: 'text',
      text: '- Item 1\n- Item 2\n- Item 3',
    }

    const { container } = render(<Text part={part} />)
    expect(container).toMatchSnapshot()
  })

  it('applies correct CSS classes', () => {
    const part: TextUIPart = {
      type: 'text',
      text: 'Test content',
    }

    const { container } = render(<Text part={part} />)
    const textDiv = container.querySelector('div')
    expect(textDiv).toHaveClass('text-sm')
    expect(textDiv).toHaveClass('px-3.5')
    expect(textDiv).toHaveClass('py-3')
    expect(textDiv).toHaveClass('border')
    expect(textDiv).toHaveClass('bg-secondary/90')
    expect(textDiv).toHaveClass('rounded-md')
    expect(textDiv).toHaveClass('font-mono')
  })
})
