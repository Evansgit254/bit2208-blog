// Mock ESM-only dependencies that Jest can't parse in node_modules
// eslint-disable-next-line @typescript-eslint/no-explicit-any
jest.mock('react-markdown', () => ({ __esModule: true, default: (p: any) => <div>{p.children}</div> }));
jest.mock('react-syntax-highlighter', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Prism: (p: any) => <pre>{p.children}</pre>
}));
jest.mock('remark-gfm', () => ({}));
// mock the style import used by react-syntax-highlighter
// mock style import used by react-syntax-highlighter
jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({ vscDarkPlus: {} }));

import { render, screen } from '@testing-library/react';
import MarkdownPreview from '../MarkdownPreview';

describe('MarkdownPreview', () => {
  it('renders markdown content', () => {
  const content = '# Hello\n\nThis is **bold** text.';
  render(<MarkdownPreview content={content} />);
  // our test environment mocks react-markdown, so verify the raw markdown string is present
  expect(screen.getByText(/# Hello/)).toBeInTheDocument();
  expect(screen.getByText(/\*\*bold\*\*/)).toBeInTheDocument();
  });
});
