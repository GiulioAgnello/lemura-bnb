import { useState, useEffect } from "react";
import { getAvailability } from "../lib/wordpress";

/**
 * Recupera le date bloccate per una specifica unità.
 *
 * @param {string|null} unit — "sternatia" | "corigliano-camera-1" | "corigliano-camera-2" | null
 * @returns {{ blocked: Array<{start:string, end:string}>, loading: boolean, error: string|null }}
 *
 * `blocked` è un array di range: [{ start: "YYYY-MM-DD", end: "YYYY-MM-DD" }]
 *
 * Uso:
 *   const { blocked, loading } = useAvailability("sternatia");
 */
export default function useAvailability(unit) {
  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!unit) {
      setBlocked([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getAvailability(unit)
      .then((data) => {
        if (!cancelled) {
          setBlocked(data?.blocked ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [unit]);

  return { blocked, loading, error };
}

/**
 * Controlla se un range di date è bloccato.
 *
 * @param {string} checkin  — "YYYY-MM-DD"
 * @param {string} checkout — "YYYY-MM-DD"
 * @param {Array<{start:string, end:string}>} blocked
 * @returns {boolean}
 */
export function isRangeBlocked(checkin, checkout, blocked) {
  if (!checkin || !checkout || !blocked?.length) return false;
  const ci = new Date(checkin);
  const co = new Date(checkout);
  return blocked.some(({ start, end }) => {
    const s = new Date(start);
    const e = new Date(end);
    // Sovrapposizione: ci < e && co > s
    return ci < e && co > s;
  });
}

/**
 * Converte l'array di range in un Set di date bloccate (YYYY-MM-DD).
 * Utile per disabilitare singoli giorni in un date picker custom.
 *
 * @param {Array<{start:string, end:string}>} blocked
 * @returns {Set<string>}
 */
export function blockedDatesSet(blocked) {
  const set = new Set();
  for (const { start, end } of blocked) {
    const current = new Date(start);
    const endDate = new Date(end);
    while (current < endDate) {
      set.add(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }
  }
  return set;
}
