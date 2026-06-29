import { isEnabled, FLAGS } from './flags';

describe('isEnabled (前端特性开关读取器)', () => {
  afterEach(() => {
    // 清理所有注入的 VITE_FLAG_* env
    for (const key of Object.keys(import.meta.env)) {
      if (key.startsWith('VITE_FLAG_')) {
        delete (import.meta.env as Record<string, unknown>)[key];
      }
    }
  });

  it('env 未注入时 fail-safe 回退 false', () => {
    expect(isEnabled(FLAGS.LIVE_METRICS_PANEL)).toBe(false);
  });

  it('VITE_FLAG_<key>=true 开启功能', () => {
    (import.meta.env as Record<string, unknown>)[`VITE_FLAG_${FLAGS.LIVE_METRICS_PANEL}`] = 'true';
    expect(isEnabled(FLAGS.LIVE_METRICS_PANEL)).toBe(true);
  });

  it('VITE_FLAG_<key>=1 也能开启功能', () => {
    (import.meta.env as Record<string, unknown>)[`VITE_FLAG_${FLAGS.LIVE_METRICS_PANEL}`] = '1';
    expect(isEnabled(FLAGS.LIVE_METRICS_PANEL)).toBe(true);
  });

  it('kill switch：env 为非 true 字符串时保持关闭', () => {
    (import.meta.env as Record<string, unknown>)[`VITE_FLAG_${FLAGS.LIVE_METRICS_PANEL}`] = 'false';
    expect(isEnabled(FLAGS.LIVE_METRICS_PANEL)).toBe(false);
  });

  it('kill switch：env 为空字符串时保持关闭', () => {
    (import.meta.env as Record<string, unknown>)[`VITE_FLAG_${FLAGS.LIVE_METRICS_PANEL}`] = '';
    expect(isEnabled(FLAGS.LIVE_METRICS_PANEL)).toBe(false);
  });
});
