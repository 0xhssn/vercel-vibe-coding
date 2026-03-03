import React from 'react'
import { render } from '@testing-library/react'
import { ToolMessage } from '../tool-message'

describe('ToolMessage Component', () => {
  it('renders with default styling', () => {
    const { container } = render(
      <ToolMessage>
        <div>Tool content</div>
      </ToolMessage>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom className', () => {
    const { container } = render(
      <ToolMessage className="custom-class">
        <div>Tool content with custom class</div>
      </ToolMessage>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with text content', () => {
    const { container } = render(<ToolMessage>Simple text content</ToolMessage>)
    expect(container).toMatchSnapshot()
  })

  it('renders with complex nested content', () => {
    const { container } = render(
      <ToolMessage>
        <div>
          <h3>Title</h3>
          <p>Description</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </ToolMessage>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with multiple children', () => {
    const { container } = render(
      <ToolMessage>
        <span>First child</span>
        <span>Second child</span>
      </ToolMessage>,
    )
    expect(container).toMatchSnapshot()
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<ToolMessage>Content</ToolMessage>)
    const toolMessage = container.querySelector('div')
    expect(toolMessage).toHaveClass('text-sm')
    expect(toolMessage).toHaveClass('px-3.5')
    expect(toolMessage).toHaveClass('py-3')
    expect(toolMessage).toHaveClass('border')
    expect(toolMessage).toHaveClass('bg-background')
    expect(toolMessage).toHaveClass('rounded-md')
    expect(toolMessage).toHaveClass('font-mono')
  })
})
