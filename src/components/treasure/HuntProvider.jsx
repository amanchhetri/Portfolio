import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ALL_GHOSTS = ['hero', 'about', 'skills', 'projects', 'experience'];
const STORAGE_KEY = 'hunt:found';

const HuntContext = createContext(null);

function readFound() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function HuntProvider({ children }) {
  const [found, setFound] = useState(() => new Set());
  const [hydrated, setHydrated] = useState(false);
  const [playOpen, setPlayOpen] = useState(false);

  useEffect(() => {
    setFound(readFound());
    setHydrated(true);
  }, []);

  const markFound = useCallback((id) => {
    if (!ALL_GHOSTS.includes(id)) return;
    setFound((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // localStorage disabled — keep in-memory only
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setFound(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      found,
      total: ALL_GHOSTS.length,
      count: found.size,
      completed: found.size === ALL_GHOSTS.length,
      hydrated,
      markFound,
      reset,
      playOpen,
      setPlayOpen,
    }),
    [found, hydrated, markFound, reset, playOpen],
  );

  return <HuntContext.Provider value={value}>{children}</HuntContext.Provider>;
}

export function useHunt() {
  const ctx = useContext(HuntContext);
  if (!ctx) throw new Error('useHunt must be used inside <HuntProvider>');
  return ctx;
}
