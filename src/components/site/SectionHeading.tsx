import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  /** Renders white-on-ink for the dark quote section. */
  invert?: boolean;
  className?: string;
}

export function SectionHeading({ eyebrow, title, intro, invert, className }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${className ?? ''}`}>
      <div className="eyebrow mb-4">{eyebrow}</div>
      <h2
        className={`text-[clamp(1.875rem,3.5vw,2.75rem)] leading-[1.1] ${invert ? 'text-white' : ''}`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-4 text-[15px] leading-relaxed ${
            invert ? 'text-white/75' : 'text-[color:var(--muted-ink)]'
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
