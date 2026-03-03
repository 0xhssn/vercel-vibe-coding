import '@testing-library/jest-dom'

// Mock next/themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  BotIcon: () => <div data-testid="bot-icon">BotIcon</div>,
  UserIcon: () => <div data-testid="user-icon">UserIcon</div>,
  CheckIcon: () => <div data-testid="check-icon">CheckIcon</div>,
  XIcon: () => <div data-testid="x-icon">XIcon</div>,
  SquareChevronRightIcon: () => (
    <div data-testid="square-chevron-right-icon">SquareChevronRightIcon</div>
  ),
  CloudUploadIcon: () => (
    <div data-testid="cloud-upload-icon">CloudUploadIcon</div>
  ),
  BoxIcon: () => <div data-testid="box-icon">BoxIcon</div>,
  LinkIcon: () => <div data-testid="link-icon">LinkIcon</div>,
  BugIcon: () => <div data-testid="bug-icon">BugIcon</div>,
  Loader: () => <div data-testid="loader">Loader</div>,
}))

// Mock react-spinners
jest.mock('react-spinners', () => ({
  PulseLoader: ({ size, className }) => (
    <div data-testid="pulse-loader" data-size={size} className={className}>
      PulseLoader
    </div>
  ),
}))

// Mock MarkdownRenderer
jest.mock('@/components/markdown-renderer/markdown-renderer', () => ({
  MarkdownRenderer: ({ content }) => (
    <div data-testid="markdown-renderer">{content}</div>
  ),
}))

// Mock react-markdown
jest.mock('react-markdown', () => {
  return function MockMarkdown({ children }) {
    return <div data-testid="react-markdown">{children}</div>
  }
})

// Mock Loader component
jest.mock('@/components/ai-elements/loader', () => ({
  Loader: () => <div data-testid="ai-loader">Loader</div>,
}))
