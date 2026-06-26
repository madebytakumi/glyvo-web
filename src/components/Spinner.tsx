import { cn } from "@/lib/cn";

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
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <Spinner className="size-10" />
    </div>
  );
}
