export function Hero() {
  return (
    <header className="hero">
      <div className="container hero-inner">
        <span className="badge">AI-First · v2.1</span>
        <h1 className="hero-title">
          为 <span className="accent">AI agent</span> 而生的前端工程范式
        </h1>
        <p className="hero-sub">
          确定性流水线、特性开关、AI 评审与自愈环——让一个全新 agent 只读 CLAUDE.md
          就能独立改一处代码并让测试通过。
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="https://github.com/wluisw/ai-frist-doc" target="_blank" rel="noreferrer">
            阅读共享文档
          </a>
          <a className="btn btn-ghost" href="#pillars-title">
            查看四大支柱
          </a>
        </div>
      </div>
    </header>
  );
}
