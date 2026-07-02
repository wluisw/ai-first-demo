import { renderHook, act } from '@testing-library/react';
import { useTheme, THEME_STORAGE_KEY } from './theme';

describe('useTheme', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('theme-dark');
  });

  it('无存储值时跟随 DARK_THEME_ENHANCED（暗）', () => {
    const { result } = renderHook(() => useTheme(true, true));
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement).toHaveClass('theme-dark');
  });

  it('无存储值时跟随 DARK_THEME_ENHANCED（亮）', () => {
    const { result } = renderHook(() => useTheme(false, true));
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement).not.toHaveClass('theme-dark');
  });

  it('切换开关开启时,localStorage 存储值优先于 flag', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const { result } = renderHook(() => useTheme(false, true));
    expect(result.current.isDark).toBe(true);
  });

  it('toggle 翻转主题、写入 localStorage、同步 <html> 类', () => {
    const { result } = renderHook(() => useTheme(false, true));
    act(() => result.current.toggle());
    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement).toHaveClass('theme-dark');

    act(() => result.current.toggle());
    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement).not.toHaveClass('theme-dark');
  });

  it('切换开关关闭时,忽略存储值、完全由 flag 控制', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const { result } = renderHook(() => useTheme(false, false));
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement).not.toHaveClass('theme-dark');
  });
});
