import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

/* ---------------------------------------------------------------- motion --
   One source of truth for `prefers-reduced-motion`. When it's set we skip the
   JS-driven reveals and loops entirely (the CSS also kills every animation),
   so the page renders in its final state with no movement at all. */

const MotionContext = createContext(false);

export function MotionProvider({ children }) {
  const [reduce, setReduce] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return <MotionContext.Provider value={reduce}>{children}</MotionContext.Provider>;
}

export function useReducedMotion() {
  return useContext(MotionContext);
}

/* ------------------------------------------------------------------ copy --
   The three install-command copy buttons (nav, hero, CTA) share one "which
   button fired last" slot so only that button shows its transient label. */

export const INSTALL_COMMAND = 'pip install "sguard[pydantic]"';

const CopyContext = createContext({ copied: null, copy: () => {} });

export function CopyProvider({ children }) {
  const [copied, setCopied] = useState(null);
  const timer = useRef(null);

  const copy = useCallback((id) => {
    try {
      navigator.clipboard?.writeText(INSTALL_COMMAND);
    } catch {
      /* clipboard unavailable (insecure context, denied permission) — the
         label still confirms the interaction, which is the useful part */
    }
    clearTimeout(timer.current);
    setCopied(id);
    timer.current = setTimeout(() => setCopied(null), 1600);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return <CopyContext.Provider value={{ copied, copy }}>{children}</CopyContext.Provider>;
}

export function useCopy() {
  return useContext(CopyContext);
}

/* ----------------------------------------------------------------- timer --
   Interval that pauses itself under reduced motion. */

export function useCycle(callback, delay) {
  const reduce = useReducedMotion();
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [reduce, delay]);
}
