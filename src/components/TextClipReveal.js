/**
 * Text wrapper kept for call sites that may gain an animation later.
 *
 * It currently renders a fragment: the old implementation added an unstyled
 * div around every heading, which changed nothing visually.
 */
export default function TextClipReveal({ children }) {
  return <>{children}</>;
}
