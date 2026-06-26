export interface MascotProps {
  /** Rendered size in pixels (square). */
  size?: number;
  className?: string;
  /** Draw a soft pastel circle behind the mascot. */
  ring?: boolean;
  /** Eye expression. */
  mood?: "happy" | "sleepy";
}
