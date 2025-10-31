
export default function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(4px)",
            zIndex: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: 30,
                minWidth: "50%",
                minHeight: "50%",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                position: "relative"
            }}>
                <button onClick={onClose} style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    border: "none",
                    background: "transparent",
                    fontSize: 24,
                    cursor: "pointer"
                }}
                >❌</button>
                {children}
            </div>
        </div>
    );
}