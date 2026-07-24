import { useState } from 'react';
import { Reveal } from './Reveal.jsx';

const TABS = [
  { id: 'python', label: 'Python API' },
  { id: 'cli', label: 'CLI' },
  { id: 'history', label: 'Repair history' },
];

function PythonExample() {
  return (
    <pre className="sg-pre sg-showcase__pre">
      <span className="tok-key">from</span>
      {' sguard '}
      <span className="tok-key">import</span>
      {` ContractGuard, RepairStatus
`}
      <span className="tok-key">from</span>
      {' schemas '}
      <span className="tok-key">import</span>
      {` WeatherReading

guard = `}
      <span className="tok-fn">ContractGuard</span>
      {`(WeatherReading)

raw = {`}
      <span className="tok-str">&quot;temp_celsius&quot;</span>
      {': '}
      <span className="tok-num">31.5</span>
      {', '}
      <span className="tok-str">&quot;humidity&quot;</span>
      {': '}
      <span className="tok-str">&quot;80&quot;</span>
      {`}
result = guard.`}
      <span className="tok-fn">repair</span>
      {`(raw)

`}
      <span className="tok-key">if</span>
      {' result.status '}
      <span className="tok-key">is</span>
      {` RepairStatus.SUCCESS:
    reading = result.value
    `}
      <span className="tok-com"># WeatherReading(temperature=31.5, humidity=80)</span>
      {`
    `}
      <span className="tok-key">for</span>
      {' r '}
      <span className="tok-key">in</span>
      {` result.repairs:
        `}
      <span className="tok-fn">print</span>
      {`(r)
    `}
      <span className="tok-com"># FuzzyRename('temp_celsius' -&gt; 'temperature')</span>
      {`
    `}
      <span className="tok-com"># TypeCoerce('humidity': str -&gt; int)</span>
    </pre>
  );
}

function CliExample() {
  return (
    <pre className="sg-pre sg-showcase__pre sg-showcase__pre--cli">
      <span className="tok-accent">$</span>
      {' stateguard check ./payloads '}
      <span className="tok-num">--schema</span>
      {` schemas:WeatherReading

  `}
      <span className="tok-ok">✓</span>
      {' reading_01.json   '}
      <span className="tok-muted">repaired</span>
      {'   2 fixes  '}
      <span className="tok-com">(FuzzyRename, TypeCoerce)</span>
      {`
  `}
      <span className="tok-ok">✓</span>
      {' reading_02.json   '}
      <span className="tok-muted">ok</span>
      {`
  `}
      <span className="tok-err">✕</span>
      {' reading_03.json   '}
      <span className="tok-err">failed</span>
      {'     missing required field '}
      <span className="tok-str">&apos;station_id&apos;</span>
      {`

  `}
      <span className="tok-dim">3 checked · 2 repaired · 1 failed</span>
      {'          '}
      <span className="tok-dim">exit 1</span>
    </pre>
  );
}

function HistoryExample() {
  return (
    <pre className="sg-pre sg-showcase__pre">
      <span className="tok-accent">$</span>
      {` tail -n 1 ~/.stateguard/repairs.jsonl | jq

`}
      <span className="tok-punct">{'{'}</span>
      {`
  `}
      <span className="tok-str">&quot;ts&quot;</span>
      {': '}
      <span className="tok-str">&quot;2026-07-24T10:12:04Z&quot;</span>
      {`,
  `}
      <span className="tok-str">&quot;schema&quot;</span>
      {': '}
      <span className="tok-str">&quot;WeatherReading&quot;</span>
      {`,
  `}
      <span className="tok-str">&quot;status&quot;</span>
      {': '}
      <span className="tok-ok">&quot;SUCCESS&quot;</span>
      {`,
  `}
      <span className="tok-str">&quot;repairs&quot;</span>
      {`: [
    { `}
      <span className="tok-str">&quot;kind&quot;</span>
      {': '}
      <span className="tok-str">&quot;FuzzyRename&quot;</span>
      {', '}
      <span className="tok-str">&quot;from&quot;</span>
      {': '}
      <span className="tok-str">&quot;temp_celsius&quot;</span>
      {', '}
      <span className="tok-str">&quot;to&quot;</span>
      {': '}
      <span className="tok-str">&quot;temperature&quot;</span>
      {` },
    { `}
      <span className="tok-str">&quot;kind&quot;</span>
      {': '}
      <span className="tok-str">&quot;TypeCoerce&quot;</span>
      {', '}
      <span className="tok-str">&quot;field&quot;</span>
      {': '}
      <span className="tok-str">&quot;humidity&quot;</span>
      {', '}
      <span className="tok-str">&quot;from&quot;</span>
      {': '}
      <span className="tok-str">&quot;str&quot;</span>
      {', '}
      <span className="tok-str">&quot;to&quot;</span>
      {': '}
      <span className="tok-str">&quot;int&quot;</span>
      {` }
  `}
      <span className="tok-punct">]</span>
      {`
`}
      <span className="tok-punct">{'}'}</span>
    </pre>
  );
}

const PANELS = {
  python: PythonExample,
  cli: CliExample,
  history: HistoryExample,
};

export function Showcase() {
  const [tab, setTab] = useState('python');
  const Panel = PANELS[tab];

  return (
    <section className="sg-section sg-section--band">
      <div className="sg-container sg-container--narrow">
        <Reveal className="sg-showcase__head">
          <div className="sg-eyebrow">In practice</div>
          <h2 className="sg-h2" style={{ marginBottom: 0 }}>
            From API to CLI to audit trail.
          </h2>
        </Reveal>

        <Reveal>
          <div role="tablist" aria-label="Usage examples" className="sg-showcase__tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`sg-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`sg-panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                className={`sg-showcase__tab${tab === t.id ? ' is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`sg-panel-${tab}`}
            aria-labelledby={`sg-tab-${tab}`}
            className="sg-code sg-showcase__panel"
          >
            <Panel />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
