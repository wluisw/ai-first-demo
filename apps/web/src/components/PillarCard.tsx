export interface Pillar {
  icon: string;
  title: string;
  desc: string;
}

export function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <article className="card">
      <div className="card-icon" aria-hidden="true">
        {pillar.icon}
      </div>
      <h3 className="card-title">{pillar.title}</h3>
      <p className="card-desc">{pillar.desc}</p>
    </article>
  );
}
