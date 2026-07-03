import { render } from '@testing-library/react';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { App } from './App';
import { isEnabled } from './lib/flags';

vi.mock('./lib/flags', () => ({
  FLAGS: {
    LIVE_METRICS_PANEL: 'live_metrics_panel',
    DARK_THEME_ENHANCED: 'dark_theme_enhanced',
  },
  isEnabled: vi.fn(),
}));

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('暗黑主题回归测试（固化 PR #3 提亮配色修复）', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('theme-dark');
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.documentElement.classList.remove('theme-dark');
  });

  it('DARK_THEME_ENHANCED 启用时 documentElement 应挂载 theme-dark 类', () => {
    vi.mocked(isEnabled).mockImplementation((key) => key === 'dark_theme_enhanced');
    render(<App />);
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true);
  });

  it('DARK_THEME_ENHANCED 禁用时 documentElement 不应有 theme-dark 类', () => {
    vi.mocked(isEnabled).mockReturnValue(false);
    render(<App />);
    expect(document.documentElement.classList.contains('theme-dark')).toBe(false);
  });

  it('组件卸载后 theme-dark 类应被自动清除（防止类名泄漏至后续测试）', () => {
    vi.mocked(isEnabled).mockImplementation((key) => key === 'dark_theme_enhanced');
    const { unmount } = render(<App />);
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true);
    unmount();
    expect(document.documentElement.classList.contains('theme-dark')).toBe(false);
  });

  describe('.theme-dark CSS 变量固化（防止配色悄然回退）', () => {
    let themeDarkVars: string;

    beforeAll(() => {
      const cssPath = resolve(__dirname, './styles.css');
      const css = readFileSync(cssPath, 'utf-8');
      const match = css.match(/\.theme-dark\s*\{([^}]+)\}/);
      expect(match, '未在 styles.css 中找到 .theme-dark 规则块').not.toBeNull();
      themeDarkVars = match![1];
    });

    // PR #3 提亮的关键色值——任何一项回退都说明修复被撤销
    const brightenedVars: Array<[string, string]> = [
      ['--color-bg', '#14141f'],
      ['--color-surface', '#1e1e30'],
      ['--color-border', '#3a3a5c'],
      ['--color-text', '#f5f5ff'],
      ['--color-muted', '#9494c4'],
      ['--color-accent', '#b0a4ff'],
    ];

    test.each(brightenedVars)('%s 应为 %s', (varName, expected) => {
      const re = new RegExp(`${varName.replace(/[-]/g, '\\$&')}:\\s*([^;]+);`);
      const m = themeDarkVars.match(re);
      expect(m, `${varName} 未定义在 .theme-dark 块中`).not.toBeNull();
      expect(m![1].trim()).toBe(expected);
    });

    it('.theme-dark 应定义 --card-glow 变量（暗黑专属发光效果）', () => {
      expect(themeDarkVars).toMatch(/--card-glow\s*:/);
    });

    it('.theme-dark 应定义 --color-accent-glow 变量', () => {
      expect(themeDarkVars).toMatch(/--color-accent-glow\s*:/);
    });
  });
});
