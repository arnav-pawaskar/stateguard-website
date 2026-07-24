import { Reveal } from './Reveal.jsx';

export function Problem() {
  return (
    <section className="sg-problem">
      <div className="sg-container">
        <Reveal className="sg-problem__head">
          <div className="sg-eyebrow">The problem</div>
          <h2 className="sg-h2">Tool calls are wired by convention, not by a compiler.</h2>
          <p className="sg-lede">
            A model returns <span className="sg-mono-inline">temp_celsius</span> where your
            schema expects <span className="sg-mono-inline">temperature</span>, or{' '}
            <span className="sg-mono-inline">&quot;31.5&quot;</span> as a string where you need
            a float. In production, that&apos;s an unhandled exception.
          </p>
        </Reveal>

        <div className="sg-problem__grid">
          <Reveal className="sg-code sg-problem__card">
            <div className="sg-problem__cardhead">
              <span className="sg-problem__cardlabel">without StateGuard</span>
              <span className="sg-problem__badge sg-problem__badge--err">
                ✕ crashes in production
              </span>
            </div>
            <pre className="sg-pre">
              <span className="tok-com">&gt;&gt;&gt; </span>
              {`WeatherReading(**llm_output)
Traceback (most recent call last):
  File `}
              <span className="tok-str">&quot;agent/run.py&quot;</span>
              {`, line `}
              <span className="tok-num">62</span>
              {`, in handle
`}
              <span className="tok-err">pydantic_core.ValidationError</span>
              {`: 2 errors for WeatherReading
temperature
  `}
              <span className="tok-err">Field required</span>
              {` [type=missing]
humidity
  `}
              <span className="tok-err">Input should be a valid integer</span>
              {` [type=int_parsing]`}
            </pre>
          </Reveal>

          <Reveal delay={90} className="sg-code sg-problem__card sg-problem__card--ok">
            <div className="sg-problem__cardhead">
              <span className="sg-problem__cardlabel">with StateGuard</span>
              <span className="sg-problem__badge sg-problem__badge--ok">
                ✓ repaired at runtime
              </span>
            </div>
            <pre className="sg-pre">
              <span className="tok-com">&gt;&gt;&gt; </span>
              {`guard.repair(llm_output)
RepairResult(
  status=`}
              <span className="tok-ok">RepairStatus.SUCCESS</span>
              {`,
  value=WeatherReading(temperature=31.5, humidity=80),
  repairs=[
    `}
              <span className="tok-accent">FuzzyRename</span>
              {`('temp_celsius' -> 'temperature'),
    `}
              <span className="tok-accent">TypeCoerce</span>
              {`('humidity': str -> int),
  ],
)`}
            </pre>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
