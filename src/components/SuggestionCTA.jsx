import { SUGGEST_PATH } from '../constants.js';
import { RouteLink } from '../router.jsx';
import { Reveal } from './Reveal.jsx';

/**
 * Landing-page band pointing at /suggest. This used to be the form itself, held
 * in local state and POSTing nowhere while telling the user it had sent — the
 * form now lives on its own page and submits to a real Google Form.
 *
 * The `#suggest` id stays so any existing /#suggest link still lands here.
 */
export function SuggestionCTA() {
  return (
    <section id="suggest" className="sg-suggest">
      <Reveal className="sg-suggest__panel">
        <div aria-hidden="true" className="sg-hairline" />
        <div className="sg-suggest__inner">
          <div>
            <div className="sg-eyebrow" style={{ marginBottom: 12 }}>
              Suggestion box
            </div>
            <h2 className="sg-suggest__h2">Seen drift we don&apos;t handle yet?</h2>
            <p className="sg-suggest__lede">
              Drop a repair strategy, a field-mismatch pattern, or anything you&apos;d want
              StateGuard to catch. It goes straight to the maintainers.
            </p>
          </div>
          <RouteLink to={SUGGEST_PATH} className="sg-btn sg-btn--primary sg-suggest__cta">
            Send a suggestion <span aria-hidden="true">→</span>
          </RouteLink>
        </div>
      </Reveal>
    </section>
  );
}
