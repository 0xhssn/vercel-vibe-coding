import React from 'react'
import { render } from '@testing-library/react'
import { Reasoning } from '../reasoning'
import type { ReasoningUIPart } from 'ai'

// Mock the useReasoningContext hook
jest.mock('../../message', () => ({
  useReasoningContext: () => ({
    expandedReasoningIndex: null,
    setExpandedReasoningIndex: jest.fn(),
  }),
}))

describe('Reasoning Message Part Component', () => {
  it('renders reasoning with done state and text', () => {
    const part: ReasoningUIPart = {
      type: 'reasoning',
      text: 'Let me think about this step by step',
      state: 'done',
    }

    const { container } = render(<Reasoning part={part} partIndex={0} />)
    expect(container).toMatchSnapshot()
  })

  it('renders reasoning with streaming state', () => {
    const part: ReasoningUIPart = {
      type: 'reasoning',
      text: 'Processing...',
      state: 'streaming',
    }

    const { container } = render(<Reasoning part={part} partIndex={0} />)
    expect(container).toMatchSnapshot()
  })

  it('renders reasoning with empty text and done state', () => {
    const part: ReasoningUIPart = {
      type: 'reasoning',
      text: '',
      state: 'done',
    }

    const { container } = render(<Reasoning part={part} partIndex={0} />)
    expect(container).toMatchSnapshot()
  })

  it('renders reasoning with multiline text', () => {
    const part: ReasoningUIPart = {
      type: 'reasoning',
      text: 'First, I need to understand the problem.\nThen, I will analyze the requirements.\nFinally, I will implement the solution.',
      state: 'done',
    }

    const { container } = render(<Reasoning part={part} partIndex={0} />)
    expect(container).toMatchSnapshot()
  })

  it('renders reasoning with bold formatting', () => {
    const part: ReasoningUIPart = {
      type: 'reasoning',
      text: '**Important**: This is a critical step',
      state: 'done',
    }

    const { container } = render(<Reasoning part={part} partIndex={0} />)
    expect(container).toMatchSnapshot()
  })

  it('renders reasoning with long text', () => {
    const part: ReasoningUIPart = {
      type: 'reasoning',
      text: 'This is a very long reasoning text that exceeds the normal length and should be truncated when not expanded. It contains multiple sentences and ideas that need to be processed.',
      state: 'done',
    }

    const { container } = render(<Reasoning part={part} partIndex={0} />)
    expect(container).toMatchSnapshot()
  })

  it('renders reasoning with short text', () => {
    const part: ReasoningUIPart = {
      type: 'reasoning',
      text: 'Quick thought',
      state: 'done',
    }

    const { container } = render(<Reasoning part={part} partIndex={0} />)
    expect(container).toMatchSnapshot()
  })

  it('renders reasoning with default thinking text when empty', () => {
    const part: ReasoningUIPart = {
      type: 'reasoning',
      text: undefined,
      state: 'streaming',
    }

    const { container } = render(<Reasoning part={part} partIndex={0} />)
    expect(container).toMatchSnapshot()
  })

  it('applies correct CSS classes', () => {
    const part: ReasoningUIPart = {
      type: 'reasoning',
      text: 'Test reasoning',
      state: 'done',
    }

    const { container } = render(<Reasoning part={part} partIndex={0} />)
    const reasoningDiv = container.querySelector('div')
    expect(reasoningDiv).toHaveClass('text-sm')
    expect(reasoningDiv).toHaveClass('border')
    expect(reasoningDiv).toHaveClass('bg-background')
    expect(reasoningDiv).toHaveClass('rounded-md')
    expect(reasoningDiv).toHaveClass('cursor-pointer')
  })
})
