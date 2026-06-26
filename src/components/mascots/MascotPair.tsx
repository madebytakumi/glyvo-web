import { cn } from "@/lib/cn";
import { Beagle } from "./Beagle";
import { Pug } from "./Pug";
import type { MascotProps } from "./types";

/** The two mascots side by side, slightly overlapping. */
export function MascotPair({
  size = 72,
  className,
  ring = true,
  mood = "happy",
}: MascotProps) {
  return (
    <div className={cn("flex items-end justify-center", className)}>
      <Beagle size={size} ring={ring} mood={mood} className="-mr-3 drop-shadow-sm" />
      <Pug size={size * 0.92} ring={ring} mood={mood} className="drop-shadow-sm" />
    </div>
  );
}
