import { useSyncExternalStore } from "react";

const LS_EVENT = "cv-ls-change";

function subscribeLS(cb: () => void) {
  window.addEventListener(LS_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(LS_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/**
 * localStorage-backed string value that stays in sync across components and
 * tabs. The value is validated against `allowed`; anything else falls back.
 * Reads return `fallback` during SSR (no window).
 */
export function useStoredValue<T extends string>(
  key: string,
  fallback: T,
  allowed: readonly T[],
): [T, (v: T) => void] {
  const value = useSyncExternalStore(
    subscribeLS,
    () => {
      const raw = window.localStorage.getItem(key);
      return raw && (allowed as readonly string[]).includes(raw)
        ? (raw as T)
        : fallback;
    },
    () => fallback,
  );
  const setValue = (v: T) => {
    window.localStorage.setItem(key, v);
    window.dispatchEvent(new CustomEvent(LS_EVENT));
  };
  return [value, setValue];
}
