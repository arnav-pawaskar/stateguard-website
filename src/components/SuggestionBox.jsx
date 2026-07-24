import { useState } from 'react';
import { Reveal } from './Reveal.jsx';

const MAX = 500;

export function SuggestionBox() {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const empty = text.trim().length === 0;

  // The prototype does not POST anywhere — wire this to a real endpoint.
  const submit = (e) => {
    e.preventDefault();
    if (empty) return;
    setSent(true);
  };

  return (
    <section id="suggest" className="sg-suggest">
      <Reveal className="sg-suggest__panel">
        <div aria-hidden="true" className="sg-hairline" />
        <div className="sg-eyebrow" style={{ marginBottom: 14 }}>
          Suggestion box
        </div>
        <h2 className="sg-suggest__h2">Seen drift we don&apos;t handle yet?</h2>
        <p className="sg-suggest__lede">
          Drop a repair strategy, a field-mismatch pattern, or anything you&apos;d want
          StateGuard to catch. It goes straight to the maintainers.
        </p>

        {sent ? (
          <div role="status" className="sg-suggest__done">
            <span aria-hidden="true" className="sg-suggest__donebadge">
              ✓
            </span>
            <div>
              <div className="sg-suggest__donetitle">Thanks — suggestion dropped.</div>
              <div className="sg-suggest__donesub">
                We read every one.{' '}
                <button
                  type="button"
                  className="sg-suggest__again"
                  onClick={() => {
                    setText('');
                    setSent(false);
                  }}
                >
                  Send another
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="sg-suggest" className="sg-sr-only">
              Your suggestion
            </label>
            <textarea
              id="sg-suggest"
              rows={4}
              className="sg-suggest__textarea"
              value={text}
              maxLength={MAX}
              onChange={(e) => setText(e.target.value.slice(0, MAX))}
            />
            <div className="sg-suggest__row">
              <span className="sg-suggest__count">
                {text.length} / {MAX}
              </span>
              <button type="submit" className="sg-suggest__submit" disabled={empty}>
                Drop suggestion <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        )}
      </Reveal>
    </section>
  );
}
