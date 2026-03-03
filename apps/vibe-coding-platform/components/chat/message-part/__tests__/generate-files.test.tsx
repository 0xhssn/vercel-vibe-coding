import React from 'react'
import { render } from '@testing-library/react'
import { GenerateFiles } from '../generate-files'
import type { DataPart } from '@/ai/messages/data-parts'

describe('GenerateFiles Message Part Component', () => {
  it('renders with generating status and single file', () => {
    const message: DataPart['generating-files'] = {
      paths: ['src/index.ts'],
      status: 'generating',
    }

    const { container } = render(<GenerateFiles message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with uploading status', () => {
    const message: DataPart['generating-files'] = {
      paths: ['src/index.ts', 'src/utils.ts'],
      status: 'uploading',
    }

    const { container } = render(<GenerateFiles message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with uploaded status', () => {
    const message: DataPart['generating-files'] = {
      paths: ['src/index.ts', 'src/utils.ts', 'src/types.ts'],
      status: 'uploaded',
    }

    const { container } = render(<GenerateFiles message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with done status', () => {
    const message: DataPart['generating-files'] = {
      paths: ['src/index.ts', 'src/utils.ts', 'src/types.ts'],
      status: 'done',
    }

    const { container } = render(<GenerateFiles message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with error status', () => {
    const message: DataPart['generating-files'] = {
      paths: ['src/index.ts', 'src/utils.ts'],
      status: 'error',
      error: {
        message: 'Failed to generate files',
      },
    }

    const { container } = render(<GenerateFiles message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with multiple completed files and one generating', () => {
    const message: DataPart['generating-files'] = {
      paths: ['src/index.ts', 'src/utils.ts', 'src/types.ts'],
      status: 'generating',
    }

    const { container } = render(<GenerateFiles message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with no files', () => {
    const message: DataPart['generating-files'] = {
      paths: [],
      status: 'done',
    }

    const { container } = render(<GenerateFiles message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with custom className', () => {
    const message: DataPart['generating-files'] = {
      paths: ['src/index.ts'],
      status: 'done',
    }

    const { container } = render(
      <GenerateFiles message={message} className="custom-class" />,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with deeply nested file paths', () => {
    const message: DataPart['generating-files'] = {
      paths: [
        'src/components/ui/button.tsx',
        'src/components/ui/input.tsx',
        'src/lib/utils.ts',
      ],
      status: 'done',
    }

    const { container } = render(<GenerateFiles message={message} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with special characters in file paths', () => {
    const message: DataPart['generating-files'] = {
      paths: [
        'src/[id]/page.tsx',
        'src/components/my-component.tsx',
        'src/utils/helper-functions.ts',
      ],
      status: 'done',
    }

    const { container } = render(<GenerateFiles message={message} />)
    expect(container).toMatchSnapshot()
  })
})
