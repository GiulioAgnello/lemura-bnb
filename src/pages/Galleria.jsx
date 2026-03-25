import { useState } from "react";
import useWP from "../hooks/useWP";
import { getGalleryImages } from "../lib/wordpress";
import Loader from "../components/Loader";

const PLACEHOLDER_IMAGES = [
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", alt: "Esterno" },
  { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80", alt: "Giardino" },
  { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", alt: "Camera" },
  { url: "https://images.unsplash.com/photo-1590490360182-c33d3bbe7bba?w=600&q=80", alt: "Terrazza" },
  { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80", alt: "Dettaglio" },
  { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", alt: "Piscina" },
  { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", alt: "Vista" },
  { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80", alt: "Colazione" },
  { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", alt: "Ingresso" },
];

export default function Galleria() {
  const { data: imagesWP, loading } = useWP(() => getGalleryImages());
  const [lightbox, setLightbox] = useState(null);

  if (loading) return <Loader />;

  const images = imagesWP?.length > 0 ? imagesWP : PLACEHOLDER_IMAGES;

  return (
    <>
      <section className="section-padding pb-0">
        <div className="container text-center fade-in">
          <span className="section-label">Galleria</span>
          <h1 className="section-title">Scopri i nostri spazi</h1>
          <hr className="section-divider section-divider-center" />
          <p style={{ maxWidth: 600, margin: "0 auto" }}>
            Le immagini della struttura, delle camere, del giardino e dei dintorni nel Salento.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="gallery-grid">
            {images.map((img, i) => (
              <div className="gallery-item fade-in" key={i} style={{ animationDelay: `${i * 0.05}s` }} onClick={() => setLightbox(i)}>
                <img src={img.url || img.sizes?.large || img} alt={img.alt || `Foto ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            style={{
              position: "absolute", top: "1.5rem", right: "1.5rem",
              background: "rgba(255,255,255,0.15)", border: "none",
              color: "#fff", fontSize: "1.5rem", width: 44, height: 44,
              borderRadius: "50%", cursor: "pointer",
            }}
          >
            ✕
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l > 0 ? l - 1 : images.length - 1)); }}
            style={{ position: "absolute", left: "1.5rem", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "1.5rem", width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}
          >
            ‹
          </button>
          <img
            src={images[lightbox]?.url || images[lightbox]?.sizes?.large || images[lightbox]}
            alt=""
            style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l < images.length - 1 ? l + 1 : 0)); }}
            style={{ position: "absolute", right: "1.5rem", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "1.5rem", width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
