import { useEffect } from "react";

import { useSyncedRef } from "./useSyncedRef";

export const useOnKeydown = (triggerKey: string, handler: () => void) => {
  const syncedHandler = useSyncedRef(handler);

  useEffect(() => {
    const handlePressKey = ({ key }: KeyboardEvent) => {
      if (key === triggerKey) {
        syncedHandler.current();
      }
    };

    window.addEventListener("keydown", handlePressKey);

    return () => window.removeEventListener("keydown", handlePressKey);
  }, [syncedHandler, triggerKey]);
};
