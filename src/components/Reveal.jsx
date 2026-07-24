import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../context.jsx';

/**
 * Fades + rises its children into view once, on scroll.
 * Under reduced motion it renders visible immediately.
 */
export function Reveal({ delay = 0, as: Tag = 'div', className = '', children, ...rest }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduce) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setTimeout(() => setVisible(true), delay);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduce, delay]);

  const classes = [reduce ? '' : 'sg-reveal', visible || reduce ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * One-time staggered load-in for the hero. `step` is the element's position in
 * the stagger — each one lands 110ms after the last.
 */
export function LoadIn({ step = 0, as: Tag = 'div', className = '', children, ...rest }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduce) return undefined;
    const id = setTimeout(() => setVisible(true), 80 + step * 110);
    return () => clearTimeout(id);
  }, [reduce, step]);

  const classes = [reduce ? '' : 'sg-load', visible || reduce ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
