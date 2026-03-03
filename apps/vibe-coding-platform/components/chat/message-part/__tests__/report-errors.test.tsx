import React from 'react'
import { render } from '@testing-library/react'
import { ReportErrors } from '../report-errors'
import type { DataPart } from '@/ai/messages/data-parts'

describe('ReportErrors Message Part Component', () => {
  it('renders with simple error summary', () => {
    const message: DataPart['report-errors'] = {
      summary: 'An error occurred during execution',
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with markdown formatted summary', () => {
    const message: DataPart['report-errors'] = {
      summary: '**Error**: Failed to compile\n\nDetails: Missing dependency',
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with error summary and file paths', () => {
    const message: DataPart['report-errors'] = {
      summary: 'Type errors found in the following files:',
      paths: ['src/index.ts', 'src/utils.ts'],
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with multiline error summary', () => {
    const message: DataPart['report-errors'] = {
      summary:
        'Multiple errors detected:\n1. Syntax error on line 42\n2. Undefined variable on line 56\n3. Type mismatch on line 78',
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with code block in summary', () => {
    const message: DataPart['report-errors'] = {
      summary:
        'Error in function:\n\n```typescript\nfunction test() {\n  return undefined.property;\n}\n```',
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with multiple file paths', () => {
    const message: DataPart['report-errors'] = {
      summary: 'Errors found in:',
      paths: [
        'src/components/Button.tsx',
        'src/components/Input.tsx',
        'src/lib/utils.ts',
        'src/types/index.ts',
      ],
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with empty paths array', () => {
    const message: DataPart['report-errors'] = {
      summary: 'General error occurred',
      paths: [],
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with long error summary', () => {
    const message: DataPart['report-errors'] = {
      summary:
        'This is a very long error message that contains detailed information about what went wrong. It includes multiple lines of explanation and context about the error that occurred during the build process. The error is critical and needs to be fixed before proceeding.',
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with special characters in summary', () => {
    const message: DataPart['report-errors'] = {
      summary: 'Error: Expected ";" but got "}"',
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with nested paths', () => {
    const message: DataPart['report-errors'] = {
      summary: 'Errors in nested directories:',
      paths: [
        'src/components/ui/button/index.tsx',
        'src/components/ui/input/index.tsx',
        'src/lib/utils/helpers/string.ts',
      ],
    }

    const { container } = render(<ReportErrors message={message} />)
    expect(container).toMatchSnapshot()
  })
})
