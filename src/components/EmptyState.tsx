import { Card } from "./Card";

export function EmptyState({ message }: { message: string }) {
  return (
    <Card className="flex items-center justify-center py-10 text-center text-muted">
      {message}
    </Card>
  );
}
