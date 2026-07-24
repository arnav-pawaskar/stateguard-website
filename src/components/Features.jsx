import { FEATURES } from '../data/content.js';
import { Reveal } from './Reveal.jsx';

export function Features() {
  return (
    <section className="sg-section">
      <div className="sg-container">
        <Reveal className="sg-features__head">
          <div className="sg-eyebrow">Features</div>
          <h2 className="sg-h2">Repairs where it can. Fails clearly where it can&apos;t.</h2>
        </Reveal>

        <div className="sg-features__grid">
          {FEATURES.map((f) => (
            <Reveal key={f.title} className="sg-feature">
              <div aria-hidden="true" className="sg-hairline" />
              <div aria-hidden="true" className="sg-feature__icon">
                {f.icon}
              </div>
              <h3 className="sg-feature__title">{f.title}</h3>
              <p className="sg-feature__body">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
