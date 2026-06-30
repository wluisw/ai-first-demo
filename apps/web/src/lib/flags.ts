/**
 * 前端侧特性开关读取器
 * ============================================================================
 * 后端的 `flags/feature-flags.ts` 是发布安全阀的事实来源(集中登记、灰度、kill switch)。
 * 浏览器里拿不到服务端 provider,所以前端用一份**只读镜像**:开关值由构建时注入的
 * Vite 环境变量(`VITE_FLAG_<key>`)决定,fail-safe 一律回退到保守默认值(关闭)。
 *
 * 与后端约定保持一致:
 *  - flag key 集中登记,杜绝裸字符串散落各处
 *  - 默认值保守(关闭),provider/env 缺失时绝不误开
 *  - 0% = 杀掉,100% = 全量(前端这层只做布尔,百分比灰度仍由服务端/边缘决定)
 */

/** 前端关心的 flag 子集(与后端 FLAGS 同名,值用同样的 snake_case 标识)。 */
export const FLAGS = {
  LIVE_METRICS_PANEL: 'live_metrics_panel',
  DARK_THEME_ENHANCED: 'dark_theme_enhanced',
} as const;

export type FlagKey = (typeof FLAGS)[keyof typeof FLAGS];

/** 保守默认值:env 未注入时的 fail-safe 回退。 */
const FLAG_DEFAULTS: Record<FlagKey, boolean> = {
  [FLAGS.LIVE_METRICS_PANEL]: false,
  [FLAGS.DARK_THEME_ENHANCED]: false,
};

/**
 * 读取 `VITE_FLAG_<key>` 环境变量并解析为布尔。
 * 例:`VITE_FLAG_live_metrics_panel=true pnpm dev` → 开启实时指标面板。
 */
export function isEnabled(key: FlagKey): boolean {
  const raw = import.meta.env[`VITE_FLAG_${key}`] as string | undefined;
  if (raw === undefined) return FLAG_DEFAULTS[key];
  return raw === 'true' || raw === '1';
}
