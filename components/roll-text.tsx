/**
 * Letters roll up to reveal a copy of themselves when the nearest `.group` is hovered.
 * CSS only, so it can render on the server.
 */
export function RollText({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex overflow-hidden">
        {Array.from(text).map((char, i) => (
          <span
            key={i}
            className="relative inline-block transition-transform duration-700 ease-out-expo group-hover:-translate-y-full group-focus-visible:-translate-y-full"
            style={{ transitionDelay: `${i * 14}ms` }}
          >
            <span className="block whitespace-pre">{char}</span>
            <span className="absolute top-full left-0 block whitespace-pre">{char}</span>
          </span>
        ))}
      </span>
    </>
  );
}
