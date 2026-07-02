import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('暗色状态显示 🌙 与 aria-pressed=true', () => {
    render(<ThemeToggle isDark={true} onToggle={() => {}} />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(btn).toHaveAccessibleName('切换到亮色主题');
  });

  it('亮色状态显示 ☀️ 与 aria-pressed=false', () => {
    render(<ThemeToggle isDark={false} onToggle={() => {}} />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(btn).toHaveAccessibleName('切换到暗色主题');
  });

  it('点击触发 onToggle', () => {
    const onToggle = vi.fn();
    render(<ThemeToggle isDark={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('图标标记为 aria-hidden（装饰性，语义靠 aria-label）', () => {
    render(<ThemeToggle isDark={true} onToggle={() => {}} />);
    expect(screen.getByText('🌙')).toHaveAttribute('aria-hidden', 'true');
  });
});
