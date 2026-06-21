"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const STORAGE_KEY = "theme";
const THEME_EVENT = "theme-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEY) === "dark";
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";

    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "تغییر به حالت روشن" : "تغییر به حالت تیره"}
      onClick={toggleTheme}
      className="inline-flex h-11 items-center gap-3 rounded-full border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-brand-400/30 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="text-xs text-muted-foreground">{isDark ? "Dark" : "Light"}</span>
      <span
        className={cn(
          "relative flex h-6 w-11 items-center rounded-full transition-colors",
          isDark ? "bg-brand-500/70" : "bg-graphite-200",
        )}
      >
        <span
          className={cn(
            "absolute flex h-5 w-5 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-transform",
            isDark ? "translate-x-5" : "translate-x-1",
          )}
        >
          {isDark ? <MoonStar className="h-3 w-3" /> : <SunMedium className="h-3 w-3" />}
        </span>
      </span>
    </button>
  );
}
