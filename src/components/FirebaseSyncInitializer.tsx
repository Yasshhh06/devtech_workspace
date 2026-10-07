"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/lib/store";

export default function FirebaseSyncInitializer() {
  const initFirebaseRealtimeSync = useWorkspaceStore((state) => state.initFirebaseRealtimeSync);

  useEffect(() => {
    const cleanup = initFirebaseRealtimeSync();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initFirebaseRealtimeSync]);

  return null;
}
