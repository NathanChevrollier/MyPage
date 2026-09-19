import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False during prerender and hydration, true afterwards — without an extra effect pass. */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
