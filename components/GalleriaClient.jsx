'use client';
import { useState } from 'react';

export default function GalleriaClient({ images }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <div className="gallery-grid">
        {images.map((img, i) => (
          <div
            className="gallery-item fade-in"
            key={i}
            style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() => setLightbox(i)}
          >
            <img
              src={img.url || img.sizes?.large || img}
              alt={img.alt || `Foto ${i + 1}`}
            />
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '1.5rem', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer' }}
          >✕</button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l > 0 ? l - 1 : images.length - 1)); }}
            style={{ position: 'absolute', left: '1.5rem', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '1.5rem', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer' }}
          >‹</button>
          <img
            src={images[lightbox]?.url || images[lightbox]?.sizes?.large || images[lightbox]}
            alt={images[lightbox]?.alt || ''}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l < images.length - 1 ? l + 1 : 0)); }}
            style={{ position: 'absolute', right: '1.5rem', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '1.5rem', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer' }}
          >›</button>
        </div>
      )}
    </>
  );
}
