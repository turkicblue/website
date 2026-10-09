/** The mark: a shangyrak seen from below, the outer ring in the text colour and the inner in turquoise. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden="true">
      <circle cx="13" cy="13" r="11.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="13" r="6.5" fill="none" stroke="var(--turquoise)" strokeWidth="1.5" />
      <path d="M6.5 10.5h13M6.5 15.5h13M10.5 6.5v13M15.5 6.5v13" stroke="currentColor" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}
