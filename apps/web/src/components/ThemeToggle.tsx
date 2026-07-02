/**
 * 主题切换按钮 —— 藏在 THEME_TOGGLE 特性开关后的新功能。
 * 纯展示组件:主题状态与持久化由 `lib/theme` 的 useTheme hook 负责。
 */
interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  const label = isDark ? '切换到亮色主题' : '切换到暗色主题';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>
    </button>
  );
}
