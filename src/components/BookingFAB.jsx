import { useState, useEffect } from "react";
import BookingWidget from "./BookingWidget";

export default function BookingFAB() {
  const [open, setOpen] = useState(false);

  // Blocca lo scroll del body quando il popup è aperto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Chiudi con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* ── Bottone fisso ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Prenota ora"
        style={{
          position: "fixed",
          bottom: "3rem",
          right: "2rem",
          zIndex: 1050,
          background: "var(--color-accent)",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          padding: "0.85rem 1.6rem",
          fontSize: "1.25rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.80)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
        }}
      >
        Prenota ora
      </button>

      {/* ── Overlay + Popup ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1060,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "var(--radius-lg)",
            }}
          >
            {/* Tasto chiudi */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Chiudi"
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 10,
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-muted)",
              }}
            >
              ✕
            </button>

            <BookingWidget />
          </div>
        </div>
      )}
    </>
  );
}
