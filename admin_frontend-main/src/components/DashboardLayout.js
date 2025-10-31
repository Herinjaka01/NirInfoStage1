import { Link, useLocation } from "react-router-dom";

function DashboardLayout({ children }) {
  const location = useLocation();

  const styles = {
    layout: {
      display: "flex",
      minHeight: "100vh",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    sidebar: {
      width: "240px",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      color: "#fff",
      padding: "24px 16px",
      boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
      position: "fixed", // pour rester en place même lors du défilement
      height: "100vh",
      top: 0,
      left: 0,
      overflowY: "auto",
    },
    content: {
      marginLeft: "240px",
      flex: 1,
      padding: "32px",
      backgroundColor: "#f9fafb",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "2.5rem",
      textAlign: "center",
      color: "#22d3ee",
    },
    nav: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    link: (isActive) => ({
      padding: "12px 16px",
      borderRadius: "8px",
      color: isActive ? "#0f172a" : "#fff",
      background: isActive
        ? "linear-gradient(135deg, #67e8f9, #0ea5e9)"
        : "transparent",
      textDecoration: "none",
      fontWeight: isActive ? "600" : "400",
      transition: "all 0.2s ease-in-out",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }),
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.title}>Admin Panel</h2>
        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.link(isActive("/dashboard"))}>
            <i className="fas fa-home"></i> Accueil
          </Link>
          <Link
            to="/dashboard/produits"
            style={styles.link(isActive("/dashboard/produits"))}
          >
            <i className="fas fa-shopping-bag"></i> Produits
          </Link>
          <Link
            to="/dashboard/packs"
            style={styles.link(isActive("/dashboard/packs"))}
          >
            <i className="fas fa-box"></i> Packs
          </Link>
          <Link
            to="/dashboard/Retraits"
            style={styles.link(isActive("/dashboard/Retraits"))}
          >
            <i className="fas fa-money-bill-wave"></i> Retraits
          </Link>
          <Link
            to="/dashboard/investisseurs"
            style={styles.link(isActive("/dashboard/investisseurs"))}
          >
            <i className="fas fa-users"></i> Investisseurs
          </Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={styles.content}>{children}</main>
    </div>
  );
}

export default DashboardLayout;
