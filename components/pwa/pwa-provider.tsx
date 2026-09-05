"use client";

import * as React from "react";
import type { BeforeInstallPromptEvent } from "@/types/pwa";

interface PWAState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
}

let deferredPromptInstance: BeforeInstallPromptEvent | null = null;
let isInstalledState = false;
let isIOSState = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function checkIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

function checkIsIOS(): boolean {
  if (typeof window === "undefined") return false;
  return (
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
    !(window as unknown as { MSStream?: unknown }).MSStream
  );
}

if (typeof window !== "undefined") {
  isInstalledState = checkIsStandalone();
  isIOSState = checkIsIOS();

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPromptInstance = e;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    isInstalledState = true;
    deferredPromptInstance = null;
    notify();
  });

  try {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", (e) => {
      if (e.matches) {
        isInstalledState = true;
        deferredPromptInstance = null;
        notify();
      }
    });
  } catch {
    // Ignore legacy media query errors
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

let cachedSnapshot: PWAState = {
  deferredPrompt: null,
  isInstallable: false,
  isInstalled: false,
  isIOS: false,
};

function getSnapshot(): PWAState {
  const isInstallable = !isInstalledState && deferredPromptInstance !== null;
  const isIOS = !isInstalledState && isIOSState;

  if (
    cachedSnapshot.deferredPrompt !== deferredPromptInstance ||
    cachedSnapshot.isInstallable !== isInstallable ||
    cachedSnapshot.isInstalled !== isInstalledState ||
    cachedSnapshot.isIOS !== isIOS
  ) {
    cachedSnapshot = {
      deferredPrompt: deferredPromptInstance,
      isInstallable,
      isInstalled: isInstalledState,
      isIOS,
    };
  }

  return cachedSnapshot;
}

const SERVER_SNAPSHOT: PWAState = {
  deferredPrompt: null,
  isInstallable: false,
  isInstalled: false,
  isIOS: false,
};

function getServerSnapshot(): PWAState {
  return SERVER_SNAPSHOT;
}

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  promptInstall: () => Promise<boolean>;
}

const PWAContext = React.createContext<PWAContextType>({
  isInstallable: false,
  isInstalled: false,
  isIOS: false,
  promptInstall: async () => false,
});

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const pwaState = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const promptInstall = React.useCallback(async (): Promise<boolean> => {
    if (!deferredPromptInstance) return false;

    try {
      await deferredPromptInstance.prompt();
      const choice = await deferredPromptInstance.userChoice;

      if (choice.outcome === "accepted") {
        isInstalledState = true;
        deferredPromptInstance = null;
        notify();
        return true;
      }

      // User dismissed: no error, button stays available
      return false;
    } catch (err) {
      console.error("[PWA] Install prompt error:", err);
      return false;
    }
  }, []);

  const value = React.useMemo(
    () => ({
      isInstallable: pwaState.isInstallable,
      isInstalled: pwaState.isInstalled,
      isIOS: pwaState.isIOS,
      promptInstall,
    }),
    [pwaState.isInstallable, pwaState.isInstalled, pwaState.isIOS, promptInstall]
  );

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
}

export function usePWA() {
  return React.useContext(PWAContext);
}
