/**
 * 实时指标面板 —— 藏在 LIVE_METRICS_PANEL 特性开关后的新功能。
 * 这里用静态示例数据演示;接入真实数据时改为读 docs-repo `contracts/` 定义的指标接口。
 */
const METRICS = [
  { label: 'PR 阅读率', value: '92%', trend: '+4', good: true },
  { label: '理解覆盖率', value: '88%', trend: '+2', good: true },
  { label: 'agent 改动率', value: '61%', trend: '-3', good: false },
  { label: '今日自愈工单', value: '7', trend: '+1', good: true },
];

export function MetricsPanel() {
  return (
    <section className="metrics" aria-labelledby="metrics-title">
      <h2 id="metrics-title" className="section-title">
        实时指标 <span className="flag-tag">flag: live_metrics_panel</span>
      </h2>
      <div className="grid metrics-grid">
        {METRICS.map((m) => (
          <div key={m.label} className="metric">
            <div className="metric-value">{m.value}</div>
            <div className="metric-label">{m.label}</div>
            <div className={m.good ? 'metric-trend up' : 'metric-trend down'}>
              {m.trend}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
