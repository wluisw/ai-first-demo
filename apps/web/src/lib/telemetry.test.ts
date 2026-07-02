import { track } from './telemetry';

describe('track (结构化遥测)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('输出单行 JSON,含 service/request_id/level/event 固定字段', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    track('theme_toggled', { theme: 'dark' });

    expect(spy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(spy.mock.calls[0][0] as string);
    expect(payload.service).toBe('ai-first-demo-web');
    expect(payload.event).toBe('theme_toggled');
    expect(payload.level).toBe('info');
    expect(payload.theme).toBe('dark');
    expect(typeof payload.request_id).toBe('string');
    expect(payload.request_id.length).toBeGreaterThan(0);
    expect(typeof payload.ts).toBe('string');
  });

  it('level=error 时走 console.error', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    track('boom', {}, 'error');
    expect(errSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(errSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe('error');
  });
});
