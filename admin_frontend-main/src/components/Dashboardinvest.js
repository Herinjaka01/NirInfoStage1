/** @format */

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
				<h2 style={styles.title}>Investisseurs Panel</h2>
				<nav style={styles.nav}>
					<Link to="/dashboard" style={styles.link(isActive("/dashboard"))}>
						<i className="fas fa-home"></i> Accueil
					</Link>

					{/* en cours de construction */}
					<Link
						to="/dashboard/ProduitDispo"
						style={styles.link(isActive("/dashboard/ProduitDispo"))}>
						<i className="fas fa-box"></i> Produit disponible
					</Link>
					{/* 
                    -Mettre fin au contrat
                    -maka vola amn zay refa fin de contrat
                    */}
					<Link
						to="/dashboard/MesInvestisments"
						style={styles.link(isActive("/dashboard/MesInvestisments"))}>
						<i className="fas fa-money-bill-wave"></i> Mes Investisments
					</Link>
				</nav>
			</aside>
			{/* Main Content */}
			<main style={styles.content}>{children}</main>
		</div>
	);
}

export default DashboardLayout;
