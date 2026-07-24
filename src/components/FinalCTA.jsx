import { InstallBox } from './InstallBox.jsx';
import { Reveal } from './Reveal.jsx';

export function FinalCTA() {
  return (
    <section id="install" className="sg-cta">
      <Reveal className="sg-cta__panel">
        <div aria-hidden="true" className="sg-cta__glow" />
        <div className="sg-cta__inner">
          <h2 className="sg-cta__h2">
            Stop schema drift from
            <br />
            crashing your agents.
          </h2>
          <p className="sg-cta__sub">
            Add StateGuard in one line — keep your pipeline running when the model
            doesn&apos;t cooperate.
          </p>

          <InstallBox id="cta" className="sg-cta__install" />

          <div className="sg-cta__buttons">
            <a href="#" className="sg-btn sg-btn--primary">
              Read the docs <span aria-hidden="true">→</span>
            </a>
            <a href="#" className="sg-btn sg-btn--secondary">
              View on GitHub{' '}
              <span aria-hidden="true" className="sg-btn__ext">
                ↗
              </span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
