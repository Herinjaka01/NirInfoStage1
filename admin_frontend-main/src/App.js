// src/App.js
import { Route, Routes } from "react-router-dom";
import AddProduit from "./pages/AddProduit";
import Dashboard from "./pages/Dashboard";
import Investisseurs from "./pages/Investisseurs";
import Login from "./pages/Login";
import Packs from "./pages/Packs";
import Produits from "./pages/Produits";
import Retraits from "./pages/Retraits";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/packs" element={<Packs />} />
      <Route path="/dashboard/produits" element={<Produits />} />
      <Route path="/dashboard/retraits" element={<Retraits />} />
      <Route path="/dashboard/produits/add" element={<AddProduit />} />
      <Route path="/dashboard/investisseurs" element={<Investisseurs />} />
    </Routes>
  );
}

export default App;
