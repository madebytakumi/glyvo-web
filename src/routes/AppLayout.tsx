import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MoreSheet } from "./MoreSheet";

/**
 * Responsive app shell: fixed sidebar on desktop (lg+), top bar + bottom tab bar
 * on mobile. Content is a centered, wide container.
 */
export function AppLayout() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur lg:hidden">
          <Brand />
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-10">
          <Outlet />
        </main>
      </div>

      <BottomNav onMore={() => setMoreOpen(true)} />
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </div>
  );
}
