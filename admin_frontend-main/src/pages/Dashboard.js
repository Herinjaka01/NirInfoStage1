// src/pages/Dashboard.js
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier le token dans le localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Rediriger vers le login si pas de token
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Bienvenue sur le Dashboard 🎯</h1>
      <p>Sélectionne une section dans la barre à gauche.</p>
      {/* Tu pourras ensuite ajouter ici le design du PDF */}
    </DashboardLayout>
  );
}

export default Dashboard;
