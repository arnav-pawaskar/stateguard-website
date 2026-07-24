import { useEffect, useRef, useState } from 'react';
import { useCycle, useReducedMotion } from '../context.jsx';
import { GitHubLink } from '../router.jsx';
import { InstallBox } from './InstallBox.jsx';
import { LoadIn } from './Reveal.jsx';

/**
 * The hero's repair terminal: a JSON payload that morphs from the model's raw
 * output (PENDING) into the repaired, schema-shaped value (SUCCESS).
 */
function RepairTerminal() {
  const reduce = useReducedMotion();
  const [repaired, setRepaired] = useState(reduce);
  const replayTimer = useRef(null);

  // reduced motion means no loop — show the resolved state and stay there
  useEffect(() => {
    if (reduce) setRepaired(true);
  }, [reduce]);

  useCycle(() => setRepaired((r) => !r), 2800);

  useEffect(() => () => clearTimeout(replayTimer.current), []);

  const replay = () => {
    clearTimeout(replayTimer.current);
    setRepaired(false);
    replayTimer.current = setTimeout(() => setRepaired(true), 450);
  };

  return (
    <div className="sg-term">
      <div aria-hidden="true" className="sg-term__ring" />
      <div className="sg-term__body">
        <div className="sg-term__bar">
          <span aria-hidden="true" className="sg-term__dot sg-term__dot--red" />
          <span aria-hidden="true" className="sg-term__dot sg-term__dot--amber" />
          <span aria-hidden="true" className="sg-term__dot sg-term__dot--green" />
          <span className="sg-term__title">guard.repair(payload)</span>
        </div>

        <div className="sg-term__json">
          <div className="tok-punct">{'{'}</div>
          <div className="sg-term__indent">
            <span className="tok-punct">&quot;</span>
            <span className="tok-str sg-term__morph">
              {repaired ? 'temperature' : 'temp_celsius'}
            </span>
            <span className="tok-punct">&quot;</span>: <span className="tok-num">31.5</span>,
          </div>
          <div className="sg-term__indent">
            <span className="tok-str">&quot;humidity&quot;</span>:{' '}
            <span className={`sg-term__morph ${repaired ? 'tok-num' : 'tok-err'}`}>
              {repaired ? '80' : '"80"'}
            </span>
          </div>
          <div className="tok-punct">{'}'}</div>
        </div>

        <div className="sg-term__foot">
          <div className="sg-term__statusrow">
            <span
              aria-live="polite"
              className={`sg-term__status${repaired ? ' is-success' : ''}`}
            >
              <span aria-hidden="true" className="sg-term__status-dot" />
              RepairStatus.{repaired ? 'SUCCESS' : 'PENDING'}
            </span>
            <button type="button" className="sg-term__replay" onClick={replay}>
              ↺ replay
            </button>
          </div>

          <div className={`sg-term__chips${repaired ? ' is-success' : ''}`}>
            <span className="sg-term__chip">
              <strong>FuzzyRename</strong> temp_celsius → temperature
            </span>
            <span className="sg-term__chip">
              <strong>TypeCoerce</strong> humidity: str → int
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="sg-hero">
      <div aria-hidden="true" className="sg-hero__watermark" />
      <div className="sg-container sg-hero__grid">
        <div className="sg-hero__copy">
          <LoadIn step={0} as="div" className="sg-hero__pill">
            <span aria-hidden="true" className="sg-hero__pill-dot" />
            Runtime contract reliability · Python
          </LoadIn>

          <LoadIn step={1} as="h1" className="sg-hero__h1">
            <span className="sg-hero__shimmer">Self-healing</span> contracts for
            AI&nbsp;pipelines.
          </LoadIn>

          <LoadIn step={2} as="p" className="sg-hero__sub">
            StateGuard sits between your LLM&apos;s output and your typed schema — catching
            field drift and type mismatches, then repairing them automatically before they
            crash your agents.
          </LoadIn>

          <LoadIn step={3} className="sg-hero__ctas">
            <a href="#install" className="sg-btn sg-btn--primary">
              Get started <span aria-hidden="true">→</span>
            </a>
            <GitHubLink className="sg-btn sg-btn--secondary">
              View on GitHub{' '}
              <span aria-hidden="true" className="sg-btn__ext">
                ↗
              </span>
            </GitHubLink>
          </LoadIn>

          <LoadIn step={4} style={{ display: 'block' }}>
            <InstallBox id="hero" />
          </LoadIn>
        </div>

        <LoadIn step={3} className="sg-hero__terminal-col">
          <RepairTerminal />
        </LoadIn>
      </div>
    </section>
  );
}
