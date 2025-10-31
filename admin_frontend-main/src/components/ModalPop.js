import { useEffect } from "react";

export default function ModalPop({ open, message, type = "success", onClose, confirmText, onConfirm }) {
  useEffect(() => {
    if (open && !confirmText) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, 2000); // 2 secondes
      return () => clearTimeout(timer);
    }
  }, [open, confirmText, onClose]);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.25)",
      backdropFilter: "blur(4px)",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "32px 40px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        minWidth: 320,
        textAlign: "center",
        border: type === "error" ? "2px solid #dc2626" : "2px solid #059669"
      }}>
        <h2 style={{
          color: type === "error" ? "#dc2626" : "#059669",
          marginBottom: 16
        }}>
          {message}
        </h2>
        {confirmText && (
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
            <button
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                background: "#059669",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer"
              }}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                background: "#999",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer"
              }}
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}