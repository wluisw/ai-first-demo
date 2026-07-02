/**
 * 前端结构化遥测 —— 与 CLAUDE.md「结构化日志(JSON)」约定对齐。
 * ============================================================================
 * 每条事件都是一行 JSON,含 `service` / `request_id` / `level` 固定字段,
 * triage 自愈环靠这些字段做聚类。demo 里直出 console;接真实采集端时,
 * 把 sink 换成上报接口即可,业务代码调用的 `track(...)` 不变。
 */

const SERVICE = 'ai-first-demo-web';

/** 生成一个尽力而为的 request_id(浏览器无 crypto 时回退到时间戳)。 */
function requestId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `r-${Date.now().toString(36)}`;
}

export type TelemetryLevel = 'info' | 'warn' | 'error';

/** 发一条结构化遥测事件。props 里不要放 PII / 凭证(见 CLAUDE.md 安全禁区)。 */
export function track(
  event: string,
  props: Record<string, string | number | boolean> = {},
  level: TelemetryLevel = 'info',
): void {
  const payload = {
    service: SERVICE,
    request_id: requestId(),
    level,
    event,
    ts: new Date().toISOString(),
    ...props,
  };
  // 结构化单行 JSON,便于日志管道解析
  console[level === 'error' ? 'error' : 'info'](JSON.stringify(payload));
}
