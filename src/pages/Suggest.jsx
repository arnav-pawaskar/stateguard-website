import {
  SUGGEST_FORM_EMBED_URL,
  SUGGEST_FORM_HEIGHT,
  SUGGEST_FORM_URL,
} from '../constants.js';
import { ExternalLink, RouteLink } from '../router.jsx';
import { Reveal } from '../components/Reveal.jsx';

/**
 * The suggestion form. Everything outside the iframe is ours; the form itself is
 * a Google Form and cannot be styled — it is cross-origin, so no CSS of ours
 * reaches inside it. Rather than half-fight that, the frame is presented as a
 * deliberate light card so it reads as an inset document instead of a theme that
 * failed to load.
 */
export function Suggest() {
  return (
    <section className="sg-section sg-suggestpage">
      <div className="sg-container sg-container--narrow">
        <Reveal className="sg-suggestpage__head">
          <div className="sg-eyebrow">Suggestion box</div>
          <h1 className="sg-suggestpage__h1">
            Seen drift we <span className="sg-grad-text">don&apos;t handle yet?</span>
          </h1>
          <p className="sg-lede">
            Send us a repair strategy, a field-mismatch pattern, or anything you&apos;d want
            StateGuard to catch. The most useful thing you can include is the payload that
            broke and the schema it should have satisfied.
          </p>
        </Reveal>

        <Reveal className="sg-suggestpage__meta">
          <p>
            Submissions go to a Google Form the maintainers read. Nothing is auto-triaged.
            Your name and email are used to follow up on your suggestion — nothing else, and
            there is no mailing list.
          </p>
        </Reveal>

        {/* Deliberately not wrapped in <Reveal>: fading and translating a 1271px
            cross-origin iframe re-composites the whole subtree for no benefit, and
            this is the thing the visitor came for — it should not wait on a scroll
            animation to become usable. */}
        <div className="sg-suggestpage__frame">
          <iframe
            title="StateGuard suggestion form"
            src={SUGGEST_FORM_EMBED_URL}
            height={SUGGEST_FORM_HEIGHT}
            loading="lazy"
            className="sg-suggestpage__iframe"
          >
            Loading…
          </iframe>
        </div>

        {/* Privacy extensions and strict tracking-protection modes block
            docs.google.com frames outright, and the iframe fails silently when
            they do. This is the way out of a blank box. */}
        <Reveal className="sg-suggestpage__foot">
          <p className="sg-suggestpage__fallback">
            Form not loading? Some privacy extensions block embedded Google Forms —{' '}
            <ExternalLink href={SUGGEST_FORM_URL}>open it in a new tab instead ↗</ExternalLink>
          </p>
          <RouteLink to="/" className="sg-btn sg-btn--secondary">
            <span aria-hidden="true">←</span> Back to home
          </RouteLink>
        </Reveal>
      </div>
    </section>
  );
}
