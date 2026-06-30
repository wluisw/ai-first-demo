import { FLAGS, isEnabled } from './lib/flags';
import { Hero } from './components/Hero';
import { PillarCard, type Pillar } from './components/PillarCard';
import { MetricsPanel } from './components/MetricsPanel';

/** AI-First harness 的四大支柱,作为首页内容。 */
const PILLARS: Pillar[] = [
  {
    icon: '🚩',
    title: '特性开关',
    desc: '每个新功能藏在开关后。先对团队开 → 灰度放量 → 全量或一键 kill,指标恶化几小时内拉掉。',
  },
  {
    icon: '🤖',
    title: 'AI 评审',
    desc: '每个 PR 过 security / performance / quality 多趟 AI 评审,BLOCK 级问题开发期漏掉评审期会拦。',
  },
  {
    icon: '🩺',
    title: 'Triage 自愈',
    desc: '错误按指纹聚类、九维打分、自动去重建单,goal loop 推动修复直到可验证的停止条件成立。',
  },
  {
    icon: '📊',
    title: '认知护栏',
    desc: 'comprehension-coverage、pr-read-rate、agent-modification-rate 三项指标守住"人没看懂就别合并"。',
  },
];

export function App() {
  const showMetrics = isEnabled(FLAGS.LIVE_METRICS_PANEL);
  const darkEnhanced = isEnabled(FLAGS.DARK_THEME_ENHANCED);
  const pageClassName = darkEnhanced ? 'page theme-dark' : 'page';

  return (
    <div className={pageClassName}>
      <Hero />

      <main className="container">
        <section aria-labelledby="pillars-title">
          <h2 id="pillars-title" className="section-title">
            四大支柱
          </h2>
          <div className="grid">
            {PILLARS.map((p) => (
              <PillarCard key={p.title} pillar={p} />
            ))}
          </div>
        </section>

        {showMetrics && <MetricsPanel />}
      </main>

      <footer className="footer">
        <span>ai-first-demo</span>
        <span>·</span>
        <span>Vite + React + TS</span>
      </footer>
    </div>
  );
}
