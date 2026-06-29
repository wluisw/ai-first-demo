import { render, screen } from '@testing-library/react';
import { MetricsPanel } from './MetricsPanel';

describe('MetricsPanel', () => {
  it('渲染指标面板标题', () => {
    render(<MetricsPanel />);
    expect(screen.getByRole('region', { name: /实时指标/i })).toBeInTheDocument();
  });

  it('渲染四个认知护栏指标', () => {
    render(<MetricsPanel />);
    expect(screen.getByText('PR 阅读率')).toBeInTheDocument();
    expect(screen.getByText('理解覆盖率')).toBeInTheDocument();
    expect(screen.getByText('agent 改动率')).toBeInTheDocument();
    expect(screen.getByText('今日自愈工单')).toBeInTheDocument();
  });

  it('显示 flag 标识提示开发者此为开关控制功能', () => {
    render(<MetricsPanel />);
    expect(screen.getByText(/live_metrics_panel/)).toBeInTheDocument();
  });
});
