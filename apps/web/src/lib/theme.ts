/**
 * 主题状态管理 —— 亮/暗主题的单一事实来源。
 * ============================================================================
 * 主题的实际开关由两层决定:
 *  - THEME_TOGGLE 开启时:用户可手动切换,选择持久化到 localStorage;
 *    首次访问无存储值时,回退到 DARK_THEME_ENHANCED flag 决定的默认。
 *  - THEME_TOGGLE 关闭时:主题完全由 DARK_THEME_ENHANCED flag 控制(旧行为)。
 * 只有这个 hook 负责给 <html> 加/去 `theme-dark` 类,避免多处 toggle 打架。
 */
import { useCallback, useEffect, useState } from 'react';
import { track } from './telemetry';

/** localStorage 键名,带项目前缀避免与其他应用冲突。 */
export const THEME_STORAGE_KEY = 'ai-first-demo:theme';

/** 读取持久化的主题偏好;无值或读取失败(隐私模式)时返回 null。 */
function readStoredTheme(): boolean | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === 'dark') return true;
    if (v === 'light') return false;
    return null;
  } catch {
    return null;
  }
}

export interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

/**
 * @param darkEnhanced  DARK_THEME_ENHANCED flag 的值(默认主题)
 * @param toggleEnabled THEME_TOGGLE flag 的值(是否允许用户手动切换)
 */
export function useTheme(darkEnhanced: boolean, toggleEnabled: boolean): ThemeState {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (toggleEnabled) {
      const stored = readStoredTheme();
      if (stored !== null) return stored;
    }
    return darkEnhanced;
  });

  // 切换功能关闭时,主题回归 flag 控制(kill switch 后不残留用户选择)
  useEffect(() => {
    if (!toggleEnabled) setIsDark(darkEnhanced);
  }, [toggleEnabled, darkEnhanced]);

  // 唯一负责同步 <html> 主题类的地方
  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', isDark);
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      } catch {
        // 隐私模式下 localStorage 不可写:忽略,当次会话内仍生效
      }
      track('theme_toggled', { theme: next ? 'dark' : 'light' });
      return next;
    });
  }, []);

  return { isDark, toggle };
}
