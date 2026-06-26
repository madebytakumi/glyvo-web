import { Card } from "./Card";
import { Beagle } from "./mascots/Beagle";
import { Pug } from "./mascots/Pug";

interface EmptyStateProps {
  message: string;
  /** Which mascot to show; alternate across sections for variety. */
  mascot?: "pug" | "beagle" | "none";
}

export function EmptyState({ message, mascot = "pug" }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted">
      {mascot === "pug" && <Pug size={72} ring mood="sleepy" />}
      {mascot === "beagle" && <Beagle size={72} ring mood="sleepy" />}
      <span>{message}</span>
    </Card>
  );
}
