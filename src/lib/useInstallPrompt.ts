import { useEffect, useState } from "react";

/** The non-standard `beforeinstallprompt` event (Chromium browsers). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallPlatform = "ios" | "android" | "desktop";

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari exposes navigator.standalone when launched from the home screen.
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function detectPlatform(): InstallPlatform {
  const ua = navigator.userAgent;
  const iOS =
    /iphone|ipad|ipod/i.test(ua) ||
    // iPadOS 13+ reports as MacIntel but is touch-capable.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (iOS) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}

/**
 * PWA install helper: exposes the native install prompt when the browser offers
 * it (Chromium), whether the app is already installed, and the platform so the
 * UI can show the right instructions (iOS has no programmatic prompt).
 */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return {
    /** A native install prompt is available (Chromium). */
    canPrompt: !!deferred,
    promptInstall,
    /** The app is running as an installed PWA. */
    installed,
    platform: detectPlatform(),
  };
}
