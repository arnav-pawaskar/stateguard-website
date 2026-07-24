import { useState } from 'react';
import { useCycle } from '../context.jsx';
import { STRATEGIES } from '../data/content.js';
import { Reveal } from './Reveal.jsx';

export function HowItWorks() {
  const [active, setActive] = useState(0);

  useCycle(() => setActive((i) => (i + 1) % STRATEGIES.length), 1700);

  const strategy = STRATEGIES[active];

  return (
    <section id="how" className="sg-section sg-section--band">
      <div className="sg-container">
        <Reveal className="sg-how__head">
          <div className="sg-eyebrow">How it works</div>
          <h2 className="sg-h2">One guard. Four repair strategies.</h2>
          <p className="sg-lede">
            StateGuard intercepts the raw output, runs it through the repair engine, and hands
            your code a validated instance of your own schema.
          </p>
        </Reveal>

        <Reveal className="sg-how__flow">
          <div className="sg-how__node">
            <div className="sg-how__nodelabel">source</div>
            <div className="sg-how__nodename">LLM output</div>
          </div>

          <span aria-hidden="true" className="sg-how__arrow">
            →
          </span>

          <div className="sg-how__node">
            <div className="sg-how__nodelabel">intercept</div>
            <div className="sg-how__nodename">ContractGuard</div>
          </div>

          <span aria-hidden="true" className="sg-how__arrow">
            →
          </span>

          <div className="sg-how__engine">
            <div className="sg-how__enginelabel">RepairEngine</div>
            <div className="sg-how__chips">
              {STRATEGIES.map((s, i) => (
                <span
                  key={s.name}
                  className={`sg-how__chip${i === active ? ' is-active' : ''}`}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          <span aria-hidden="true" className="sg-how__arrow sg-how__arrow--out">
            →
          </span>

          <div className="sg-how__node sg-how__node--validated">
            <div className="sg-how__nodelabel">validated</div>
            <div className="sg-how__nodename">Typed schema</div>
          </div>
        </Reveal>

        <p aria-live="polite" className="sg-how__caption">
          <strong>{strategy.name}</strong> — {strategy.desc}
        </p>
      </div>
    </section>
  );
}
