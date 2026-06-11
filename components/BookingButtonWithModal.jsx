'use client';
import { useState, useEffect } from 'react';
import BookingWidget from './BookingWidget';

export default function BookingButtonWithModal({ label = 'Prenota il soggiorno', className = 'btn-bnb btn-bnb-accent' }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1060,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative', width: '100%', maxWidth: '900px',
              maxHeight: '90vh', overflowY: 'auto',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Chiudi"
              style={{
                position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer',
                fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-muted)',
              }}
            >✕</button>
            <BookingWidget />
          </div>
        </div>
      )}
    </>
  );
}
