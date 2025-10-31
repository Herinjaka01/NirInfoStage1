import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/Modal";
import ModalPop from "../components/ModalPop";
import api from "../services/api";
import "../styles/animations.css";
import styles from "../styles/PacksStyles";

function Packs() {
  const [packs, setPacks] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const [minInvest, setMinInvest] = useState("");
  const [roi, setRoi] = useState("");
  const [quantite, setQuantite] = useState("");
  const [produits, setProduits] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("pack_name");
  const [sortDir, setSortDir] = useState("asc");

  // Pour la sélection des produits
  const [allProduits, setAllProduits] = useState([]);
  const [produitSearch, setProduitSearch] = useState("");
  const [produitPage, setProduitPage] = useState(1);
  const produitsPerPage = 10;
  
  useEffect(() => {
    api.get("products").then(({ data }) => setAllProduits(data));
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" ou "edit"
  const [editingPack, setEditingPack] = useState(null);

  const [errors, setErrors] = useState({});


  const [modalPopOpen, setModalPopOpen] = useState(false);
  const [modalPopMsg, setModalPopMsg] = useState("");
  const [modalPopType, setModalPopType] = useState("success");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => {});


  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      const { data } = await api.get("packs");
      // S'assurer que data est un tableau
      setPacks(Array.isArray(data) ? data : []);
    } catch {
      setModalPopMsg("Erreur lors du chargement des packs");
      setModalPopType("error");
      setModalPopOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const qte = parseInt(quantite, 10);
    const invest = parseFloat(minInvest);
    const retour = parseFloat(roi);
    const produit = parseInt(produits, 10);
    const selectedProduct = allProduits.find(p => p.product_id === produit.toString());
    const stock = selectedProduct?.available_quantity || 0;


    const newErrors = {};

    // Validation des champs
    if (!produit || produit <= 0) {
      newErrors.produit = "Veuillez sélectionner un produit.";
    }
    if (isNaN(qte) || qte < 1) {
      newErrors.quantite = "La quantité doit être supérieure à 0.";
    }
    if (isNaN(invest) || invest <= 0) {
      newErrors.invest = "Le montant minimum d'investissement doit être valide.";
    }
    if (isNaN(retour) || retour < 0 || retour > 100) {
      newErrors.roi = "Le ROI doit être entre 0 et 100.";
    }
    // Validation du stock : vérifier que la quantité demandée ne dépasse pas le stock disponible
    if (modalMode === "add" && qte > stock) {
      newErrors.quantite = `Stock insuffisant ! Disponible: ${stock} unités, demandé: ${qte} unités. Veuillez réduire la quantité.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Préparer les données à envoyer au backend
      const packData = {
        product_id: produit,
        expected_goal: qte,
        min_investment: invest,
        return_on_investment: retour
      };

      await api.post("packs", packData);
      
      showSuccess("Pack ajouté avec succès ✅");
      resetForm();
      setModalOpen(false);
      fetchPacks(); // Recharger la liste des packs
      
      // Recharger les produits pour avoir le stock à jour
      api.get("products").then(({ data }) => setAllProduits(data));
    } catch (error) {
      console.error(error);
      showError("Erreur lors de l'enregistrement du pack ❌");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  // Suppression d'un pack
  const handleDelete = (packId) => {
    setConfirmMsg("Êtes-vous sûr de vouloir supprimer ce pack ?");
    setConfirmAction(() => async () => {
      setConfirmOpen(false);
      setIsLoading(true);
      
      try {
        await api.delete(`packs/${packId}`);
        
        showSuccess("Pack supprimé avec succès 🎯");
        fetchPacks();
        
        // Recharger les produits pour avoir le stock à jour
        api.get("products").then(({ data }) => setAllProduits(data));
      } catch (err) {
        console.error(err);
        showError("Erreur lors de la suppression du pack ❌");
      }
      setIsLoading(false);
    });
    setConfirmOpen(true);
  };
  // Modification d'un pack
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingPack) return;
    
    try {
      await api.put(`packs/${editingPack.id}`, {
        product_id: editingPack.produit,
        objective_quantity: editingPack.quantite,
        return_on_investment: editingPack.roi,
        min_investment: editingPack.min_invest,
      });
      
      setEditingPack(null);
      setModalOpen(false);
      fetchPacks();
      showSuccess("Pack modifié avec succès ✅");
      
      // Recharger les produits pour avoir le stock à jour
      api.get("products").then(({ data }) => setAllProduits(data));
    } catch (error) {
      showError("Erreur lors de la modification ❌");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMinInvest("");
    setRoi("");
    setQuantite("");
    setProduits("");
    setModalOpen(false);
  };

  // Ouvrir la modale pour modification
  const openEditModal = (pack) => {
    setModalMode("edit");
    setEditingPack({
      id: pack.pack_id || pack.id,
      pack_name: pack.pack_name || "",
      min_invest: pack.min_investment || "",
      roi: pack.return_on_investment || "",
      quantite: pack.objective_quantity || "",
      produit: pack.product_id || "",
    });
    setModalOpen(true);
  };

  // Ouvrir la modale pour ajout
  const openAddModal = () => {
    setModalMode("add");
    resetForm();
    setEditingPack(null);
    setModalOpen(true);
  };

    // Pour afficher un message de succès
  const showSuccess = (msg) => {
  setModalPopMsg(msg);
  setModalPopType("success");
  setModalPopOpen(true);
};
  
  // Pour afficher un message d’erreur
  const showError = (msg) => {
  setModalPopMsg(msg);
  setModalPopType("error");
  setModalPopOpen(true);
};

  const filteredSortedPacks = [...packs]
  .filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.pack_name || "").toLowerCase().includes(q) ||
      (p.product_name || String(p.product_id || "")).toLowerCase().includes(q)
    );
  })
  .sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    const num = (v) => (v === null || v === undefined || v === "" ? 0 : Number(v));
    if (sortField === "pack_name") {
      const va = (a.pack_name || "").toLowerCase(); const vb = (b.pack_name || "").toLowerCase();
      return va < vb ? -1 * dir : va > vb ? 1 * dir : 0;
    }
    if (sortField === "objective_quantity") return (num(a.objective_quantity) - num(b.objective_quantity)) * dir;
    if (sortField === "return_on_investment") return (num(a.return_on_investment) - num(b.return_on_investment)) * dir;
    if (sortField === "min_investment") return (num(a.min_investment) - num(b.min_investment)) * dir;
    if (sortField === "order_start_date") {
      const va = new Date(a.order_start_date || 0).getTime();
      const vb = new Date(b.order_start_date || 0).getTime();
      return (va - vb) * dir;
    }
    return 0;
  });

  const totalItems = filteredSortedPacks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPacks = filteredSortedPacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filteredProduits = allProduits.filter(p =>
    p.name.toLowerCase().includes(produitSearch.toLowerCase())
  );
  const totalProduitPages = Math.max(1, Math.ceil(filteredProduits.length / produitsPerPage));
  const paginatedProduits = filteredProduits.slice(
    (produitPage - 1) * produitsPerPage,
    produitPage * produitsPerPage
  );

  return (
    <>

        <ModalPop
          open={modalPopOpen}
          message={modalPopMsg}
          type={modalPopType}
          onClose={() => setModalPopOpen(false)}
      />
      
      <ModalPop
        open={confirmOpen}
        message={confirmMsg}
        type="error"
        confirmText="Supprimer"
        onConfirm={confirmAction}
        onClose={() => setConfirmOpen(false)}
      />

      {/* Modal d'ajout/modification */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h2 style={{ marginBottom: 16, textAlign: "center" }}>
            {modalMode === "add" ? "Ajouter un pack" : "Modifier le pack"}
          </h2>
          <form
            onSubmit={modalMode === "add" ? handleSubmit : handleEditSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}
        >
                <input
                  type="text"
                placeholder="Produit"
                  value={
                  modalMode === "add"
                    ? produitSearch || (produits && allProduits.find(p => p.product_id === produits)?.name) || ""
                    : editingPack?.produit
                    ? allProduits.find(p => p.product_id === editingPack.produit)?.name || editingPack.produit
                    : ""
              }
              onChange={e => {
                setProduitSearch(e.target.value);
                setProduitPage(1);
                if (modalMode === "add") setProduits(""); // reset sélection
                else if (editingPack) setEditingPack({ ...editingPack, produit: "" });
              }}
              onFocus={() => setProduitSearch("")}
              required
              style={{
                width: "80%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "1rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
          />
                <input
                  type="number"
              placeholder="Investissement minimum (Ar)"
              value={modalMode === "add" ? minInvest : editingPack?.min_invest || ""}
              onChange={(e) => {
                if (modalMode === "add") setMinInvest(e.target.value);
                else if (editingPack) setEditingPack({ ...editingPack, min_invest: e.target.value });
              }}
                  required
              style={{
                width: "80%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "1rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
          />
          {errors.quantite && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.invest}</p>
          )}
                <input
                  type="number"
              placeholder="ROI (%)"
              value={modalMode === "add" ? roi : editingPack?.roi || ""}
              onChange={(e) => {
                if (modalMode === "add") setRoi(e.target.value);
                else if (editingPack) setEditingPack({ ...editingPack, roi: e.target.value });
              }}
                  required
              style={{
                width: "80%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "1rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
          />
          {errors.quantite && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.roi}</p>
          )}
                <input
                  type="number"
              placeholder="Quantité incluse"
              value={modalMode === "add" ? quantite : editingPack?.quantite || ""}
              onChange={(e) => {
                if (modalMode === "add") setQuantite(e.target.value);
                else if (editingPack) setEditingPack({ ...editingPack, quantite: e.target.value });
              }}
                  required
              style={{
                width: "80%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "1rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
          />
          {errors.quantite && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.quantite}</p>
          )}
            {produitSearch !== "" && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                zIndex: 10,
                maxHeight: 220,
                overflowY: "auto"
              }}>
                {paginatedProduits.map(prod => (
                  <div
                    key={prod.product_id}
                    onClick={() => {
                      if (modalMode === "add") {
                        setProduits(prod.product_id);
                        setProduitSearch(prod.name);
                      } else if (editingPack) {
                        setEditingPack({ ...editingPack, produit: prod.product_id });
                        setProduitSearch(prod.name);
                      }
                    }}
                style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span>{prod.name}</span>
                    <span style={{ 
                      fontSize: "0.8rem", 
                      color: "#6b7280",
                      fontWeight: "bold",
                      backgroundColor: "#f3f4f6",
                      padding: "2px 8px",
                      borderRadius: "4px"
                    }}>
                      Stock: {prod.available_quantity}
                    </span>
                    {errors.quantite && (
                      <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.produit}</p>
                    )}
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>
                  <button
                    disabled={produitPage === 1}
                    onClick={() => setProduitPage(produitPage - 1)}
                    style={{
                      border: "none",
                      background: "#e0f2fe", 
                      borderRadius: 6, 
                      padding: "4px 10px", 
                      // cursor: "pointer",
                  }}
                  >
                    <i className="fa-solid fa-backward-fast"></i>
                  </button>
                  <span>Page {produitPage} / {totalProduitPages}</span>
                  <button
                    disabled={produitPage === totalProduitPages}
                    onClick={() => setProduitPage(produitPage + 1)}
                  style={{
                    border: "none",
                    background: "#e0f2fe",
                    borderRadius: 6,
                    padding: "4px 10px", 
                    // cursor: "pointer",
                  }}
                  >
                    <i className="fa-solid fa-forward-fast"></i>
                  </button>
                </div>
              </div>
            )}
            <button type="submit" style={{
              width: "80%",
              padding: "12px",
              borderRadius: "8px",
              background: "#059669",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              marginTop: "8px",
              boxShadow: "0 2px 8px rgba(5,150,105,0.08)"
            }}>
              {modalMode === "add" ? "Ajouter" : "Enregistrer"}
            </button>
          </form>
        </Modal>

      <DashboardLayout>
        <div style={styles.container} >
          <div style={styles.header}>
            <h1 style={styles.title}>Packs d'investissement</h1>
            <p style={styles.subtitle}>Gérez vos opportunités d'investissement</p>
              </div>

          <div>
                <button
              type="submit"
              onClick={openAddModal}
              title="Ajouter"
              className="img-btn"
              >
                <i className="fas fa-plus" ></i>
                </button>
              </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
            <input
              type="text"
              placeholder="Rechercher (nom pack, produit)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6, minWidth: 240 }}
            />
            <select value={sortField} onChange={(e) => setSortField(e.target.value)} style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }}>
              <option value="pack_name">Nom</option>
              <option value="objective_quantity">Quantité incluse</option>
              <option value="return_on_investment">ROI</option>
              <option value="min_investment">Invest. min</option>
              <option value="order_start_date">Date</option>
            </select>
            <select value={sortDir} onChange={(e) => setSortDir(e.target.value)} style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }}>
              <option value="asc">Ascendant</option>
              <option value="desc">Descendant</option>
            </select>
            </div>

          <div style={{ overflow: "auto", marginTop: 24 }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              tableLayout: "fixed"
            }}>
              <thead style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: 12, textAlign: "left",width: 90}}>Nom</th>
                  <th style={{ padding: 12, textAlign: "left",width: 70}}>Produit</th>
                  <th style={{ padding: 12, textAlign: "left",width: 50}}>Qte incluse</th>
                  <th style={{ padding: 12, textAlign: "left",width: 50}}>ROI (%)</th>
                  <th style={{ padding: 12, textAlign: "left",width: 70}}>Invest. min (Ar)</th>
                  <th style={{ padding: 12, textAlign: "left",width: 90}}>Stock Produit</th>
                  <th style={{ padding: 12, textAlign: "left",width: 90}}>Date</th>
                  <th style={{ padding: 12, textAlign: "left",width: 160}}>Action</th>
                </tr>
              </thead>
              <tbody>
                  {paginatedPacks.map((pack) => (
                  <tr key={pack.pack_id || pack.id}>
                        <td style={{ padding: 12 }}>{pack.pack_name}</td>
                        <td style={{ padding: 12 }}>{pack.product_name}</td>
                        <td style={{ padding: 12 }}>{pack.objective_quantity ?? "N/A"}</td>
                        <td style={{ padding: 12 }}>{pack.return_on_investment ?? 0}</td>
                        <td style={{ padding: 12 }}>{parseFloat(pack.min_investment).toLocaleString()} Ar</td>
                        <td style={{ padding: 12 }}>
                          {pack.available_quantity}
                        </td>
                        <td style={{ padding: 12 }}>{formatDate(pack.order_start_date)}</td>
                        <td style={{ padding: 12, display: "flex", gap: 30 }}>
                          <button
                            onClick={() => openEditModal(pack)}
                            className="img-btn-modif"
                            title= "Modifier"
                            >
                              <i className="fas fa-edit" style={{color: "blue"}}></i>
                            </button>
                          <button
                            onClick={() => handleDelete(pack.pack_id || pack.id)}
                            title="Supprimer"
                            className="img-btn-sup"
                          >
                            <i className="fas fa-trash" style={{color: "red"}}></i>
                          </button>
                          </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="page-nav">
          <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer"}}
              title="Precedent"
            >
              <i className="fa-solid fa-backward-fast"></i>
            </button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer" }}
              title="Suivant"
            >
              <i className="fa-solid fa-forward-fast"></i>
            </button>
      </div>
    </DashboardLayout>
    </>
  );
}

export default Packs;
