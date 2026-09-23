export function isReservedKeypress(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return true;
  const target = event.target instanceof Element ? event.target : null;
  return Boolean(target?.closest("input, textarea, select, [contenteditable='true']"));
}
