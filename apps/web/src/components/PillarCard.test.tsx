import { render, screen } from '@testing-library/react';
import { PillarCard, type Pillar } from './PillarCard';

const PILLAR: Pillar = {
  icon: '🚩',
  title: '特性开关',
  desc: '每个新功能藏在开关后。',
};

describe('PillarCard', () => {
  it('渲染图标、标题、描述', () => {
    render(<PillarCard pillar={PILLAR} />);
    expect(screen.getByText('🚩')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '特性开关' })).toBeInTheDocument();
    expect(screen.getByText('每个新功能藏在开关后。')).toBeInTheDocument();
  });

  it('图标标记为 aria-hidden（装饰性）', () => {
    render(<PillarCard pillar={PILLAR} />);
    const icon = screen.getByText('🚩');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('长描述文本完整渲染', () => {
    const longDesc = 'a'.repeat(300);
    render(<PillarCard pillar={{ ...PILLAR, desc: longDesc }} />);
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });
});
