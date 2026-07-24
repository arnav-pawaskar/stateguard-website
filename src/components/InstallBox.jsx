import { useCopy } from '../context.jsx';

/**
 * The copyable `pip install` command, shared by the hero and the final CTA.
 * `id` scopes the transient "copied" label to the button that was clicked.
 */
export function InstallBox({ id, className = '' }) {
  const { copied, copy } = useCopy();

  return (
    <div className={`sg-install ${className}`.trim()}>
      <span className="sg-install__prompt" aria-hidden="true">
        $
      </span>
      <span className="sg-install__cmd">
        pip install <span className="tok-str">&quot;sguard[pydantic]&quot;</span>
      </span>
      <button
        type="button"
        className="sg-install__copy"
        onClick={() => copy(id)}
        aria-label="Copy install command"
      >
        {copied === id ? 'copied ✓' : 'copy'}
      </button>
    </div>
  );
}
