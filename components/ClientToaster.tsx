"use client";

import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

/**
 * Renders react-hot-toast only after client mount.
 * This prevents the hydration mismatch caused by Toaster injecting a
 * data-rht-toaster div during SSR that doesn't match the client tree.
 */
export function ClientToaster() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "var(--font-geist-sans)",
          fontSize: "13px",
          fontWeight: 600,
        },
      }}
    />
  );
}
