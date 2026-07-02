import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('默认不显示 MetricsPanel（feature flag 默认关闭）', () => {
    render(<App />);
    expect(screen.queryByText(/live_metrics_panel/)).not.toBeInTheDocument();
  });

  it('默认不显示主题切换按钮（THEME_TOGGLE 默认关闭）', () => {
    render(<App />);
    expect(screen.queryByRole('button', { name: /切换到.*主题/ })).not.toBeInTheDocument();
  });

  it('渲染四大支柱标题', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /四大支柱/i })).toBeInTheDocument();
  });

  it('渲染四张支柱卡片', () => {
    render(<App />);
    expect(screen.getByText('特性开关')).toBeInTheDocument();
    expect(screen.getByText('AI 评审')).toBeInTheDocument();
    expect(screen.getByText('Triage 自愈')).toBeInTheDocument();
    expect(screen.getByText('认知护栏')).toBeInTheDocument();
  });

  it('渲染 footer', () => {
    render(<App />);
    expect(screen.getByText('ai-first-demo')).toBeInTheDocument();
  });
});
