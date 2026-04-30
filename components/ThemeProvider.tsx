"use client";

import * as React from "react";

// ThemeProvider is a no-op wrapper — this app is locked to light mode.
// next-themes is intentionally bypassed to prevent the "script tag" hydration warning
// it injects a color-scheme detection script that React warns about in client components.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
