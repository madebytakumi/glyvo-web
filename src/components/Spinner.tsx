import { cn } from "@/lib/cn";
import { MascotPair } from "./mascots/MascotPair";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-6 animate-spin rounded-full border-2 border-primary border-t-transparent",
        className,
      )}
      role="status"
      aria-label="loading"
    />
  );
}

export function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-bg">
      <MascotPair size={80} />
      <Spinner className="size-8" />
    </div>
  );
}
