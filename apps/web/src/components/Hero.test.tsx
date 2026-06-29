import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('渲染主标题', () => {
    render(<Hero />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText(/AI agent/i)).toBeInTheDocument();
  });

  it('渲染版本徽章', () => {
    render(<Hero />);
    expect(screen.getByText(/AI-First/)).toBeInTheDocument();
  });

  it('文档链接指向 docs-repo', () => {
    render(<Hero />);
    const docLink = screen.getByRole('link', { name: /阅读共享文档/i });
    expect(docLink).toHaveAttribute('href', expect.stringContaining('ai-frist-doc'));
    expect(docLink).toHaveAttribute('target', '_blank');
    expect(docLink).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('内部锚点链接存在', () => {
    render(<Hero />);
    const anchor = screen.getByRole('link', { name: /查看四大支柱/i });
    expect(anchor).toHaveAttribute('href', '#pillars-title');
  });
});
