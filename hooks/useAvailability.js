import { useState, useEffect } from 'react';
import { getAvailability } from '@/lib/wordpress';

export default function useAvailability(unit) {
  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!unit) { setBlocked([]); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAvailability(unit)
      .then((data) => { if (!cancelled) { setBlocked(data?.blocked ?? []); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [unit]);

  return { blocked, loading, error };
}

export function isRangeBlocked(checkin, checkout, blocked) {
  if (!checkin || !checkout || !blocked?.length) return false;
  const ci = new Date(checkin);
  const co = new Date(checkout);
  return blocked.some(({ start, end }) => {
    const s = new Date(start);
    const e = new Date(end);
    return ci < e && co > s;
  });
}

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
