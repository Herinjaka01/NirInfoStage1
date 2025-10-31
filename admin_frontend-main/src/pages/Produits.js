import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/Modal";
import ModalPop from "../components/ModalPop";
import api from "../services/api";
import styles from "./ProduitsStyles";

function Produits() {
  const [produits, setProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // États du formulaire pour la modale
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [quantite, setQuantite] = useState("");
  const [image, setImage] = useState(null);

  // États pour la modale
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" ou "edit"
  const [editingProduct, setEditingProduct] = useState(null);

  // Recherche et tri
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Référence pour le champ fichier
  const fileInputRef = useRef(null);

  const [modalPopOpen, setModalPopOpen] = useState(false);
    const [modalPopMsg, setModalPopMsg] = useState("");
    const [modalPopType, setModalPopType] = useState("success");
  
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMsg, setConfirmMsg] = useState("");
    const [confirmAction, setConfirmAction] = useState(() => {});

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const { data } = await api.get("products");
      setProduits(data);
    } catch (error) {
      setModalPopMsg("Erreur lors du chargement des produits");
      setModalPopType("error");
      setModalPopOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajout d'un produit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", nom);
    formData.append("description", description);
    formData.append("unit_price", prix);
    formData.append("available_quantity", quantite);
    if (image) formData.append("image", image);

    try {
      await api.post("products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showSuccess("Produit créé avec succès 🎯");
      resetForm();
      fetchProduits();
    } catch (error) {
      showError("Erreur lors de la création du produit ❌");
    }
  };

  // Modification d'un produit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await api.put(`products/${editingProduct.id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        unit_price: Number(editingProduct.unit_price),
        available_quantity: Number(editingProduct.available_quantity),
      });
      showSuccess("Produit modifié avec succès ✅");
      setEditingProduct(null);
      setModalOpen(false);
      fetchProduits();
    } catch (error) {
      showError("Erreur lors de la modification ❌");
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = async (id) => {
    setConfirmMsg("Êtes-vous sûr de vouloir supprimer ce pack ?");
    setConfirmAction(() => async () => {
      setConfirmOpen(false);
      setIsLoading(true);
      try {
        await api.delete(`products/${id}`);
        showSuccess("Produit supprimé ✅");
        fetchProduits();
      } catch (e) {
        showError("Suppression impossible ❌");
      } finally {
        setIsLoading(false);
      }
    });
    setConfirmOpen(true);
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

  // Reset le formulaire d'ajout
  const resetForm = () => {
    setNom("");
    setDescription("");
    setPrix("");
    setQuantite("");
    setImage(null);
    setModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Ouvrir la modale pour modification
  const openEditModal = (produit) => {
    setModalMode("edit");
    setEditingProduct({
      id: produit.product_id || produit.id,
      name: produit.name || "",
      description: produit.description || "",
      unit_price: produit.unit_price || "",
      available_quantity: produit.available_quantity || "",
    });
    setModalOpen(true);
  };

  // Ouvrir la modale pour ajout
  const openAddModal = () => {
    setModalMode("add");
    resetForm();
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Filtrer et trier les produits
  const filteredSortedProduits = [...produits]
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      let va, vb;
      if (sortField === "name") {
        va = (a.name || "").toLowerCase();
        vb = (b.name || "").toLowerCase();
        return va < vb ? -1 * dir : va > vb ? 1 * dir : 0;
      }
      if (sortField === "unit_price") {
        va = a.unit_price || 0;
        vb = b.unit_price || 0;
        return (va - vb) * dir;
      }
      if (sortField === "available_quantity") {
        va = a.available_quantity || 0;
        vb = b.available_quantity || 0;
        return (va - vb) * dir;
      }
      return 0;
    });

  // Pagination
  const totalItems = filteredSortedProduits.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProduits = filteredSortedProduits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalProduits = produits.length;

  const totalValue = produits.reduce((sum, p) => {
    const prix = p.unit_price || 0;
    const qty = Number(p.available_quantity || 0);
    return sum + prix * qty;
  }, 0);

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
          {modalMode === "add" ? "Ajouter un produit" : "Modifier le produit"}
        </h2>
        <form
          onSubmit={modalMode === "add" ? handleSubmit : handleEditSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}
          encType="multipart/form-data"
        >
          <input
            type="text"
            placeholder="Nom du produit"
            value={
              modalMode === "add"
                ? nom
                : editingProduct
                ? editingProduct.name
                : ""
            }
            onChange={(e) => {
              if (modalMode === "add") {
                setNom(e.target.value);
              } else if (editingProduct) {
                setEditingProduct({ ...editingProduct, name: e.target.value });
              }
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
          <textarea
            placeholder="Description"
            value={
              modalMode === "add"
                ? description
                : editingProduct
                ? editingProduct.description
                : ""
            }
            onChange={(e) => {
              if (modalMode === "add") {
                setDescription(e.target.value);
              } else if (editingProduct) {
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                });
              }
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
          <input
            type="number"
            placeholder="Prix unitaire (en Ar)"
            value={
              modalMode === "add"
                ? prix
                : editingProduct
                ? editingProduct.unit_price
                : ""
            }
            onChange={(e) => {
              if (modalMode === "add") {
                setPrix(e.target.value);
              } else if (editingProduct) {
                setEditingProduct({
                  ...editingProduct,
                  unit_price: e.target.value,
                });
              }
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
          <input
            type="number"
            placeholder="Quantité disponible"
            value={
              modalMode === "add"
                ? quantite
                : editingProduct
                ? editingProduct.available_quantity
                : ""
            }
            onChange={(e) => {
              if (modalMode === "add") {
                setQuantite(e.target.value);
              } else if (editingProduct) {
                setEditingProduct({
                  ...editingProduct,
                  available_quantity: e.target.value,
                });
              }
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
          {modalMode === "add" && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              ref={fileInputRef}
            />
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
        <div style={styles.container}>
          <h1 style={styles.title}>Produits</h1>
          <p style={styles.subtitle}>Ajoutez un produit et visualisez la liste</p>

          {/* Bouton d’ajout */}
          <button
            type="button"
            className="img-btn"
            title="Ajouter"
            onClick={openAddModal}
          >
            <i className="fas fa-plus"></i>
          </button>

          {/* Résumé */}
          <div style={styles.resume}>
            <div>
              <h4>Nombre total de produits</h4>
              <p style={styles.priceValue}>{totalProduits}</p>
            </div>
            <div>
              <h4>Valeur totale du stock</h4>
              <p style={styles.priceValue}>{totalValue.toLocaleString()} Ar</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
            <input
              type="text"
              placeholder="Rechercher (nom, description)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1);
              }}
              style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6, minWidth: 240 }}
            />
            <select value={sortField} onChange={(e) => setSortField(e.target.value)} style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }}>
              <option value="name">Nom</option>
              <option value="unit_price">Prix unitaire</option>
              <option value="available_quantity">Quantité</option>
            </select>
            <select value={sortDir} onChange={(e) => setSortDir(e.target.value)} style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }}>
              <option value="asc">Ascendant</option>
              <option value="desc">Descendant</option>
            </select>
          </div>
          
          {/* Tableau de produits */}
          {isLoading ? (
            <p>Chargement...</p>
          ) : (
            <div style={{ overflowX: "auto", marginTop: "24px" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                tableLayout: "fixed"
              }}>
                <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <tr>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Image</th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Nom</th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Description</th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Prix unitaire</th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Quantité</th>
                    <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProduits.map((produit) => {
                    const id = produit.product_id || produit.id;
                    return (
                      <tr key={id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "12px" }}>
                          <img
                            src={
                              produit.image_url
                                ? `http://localhost:8080${produit.image_url}`
                                : "https://via.placeholder.com/80x60?text=Aucune+Image"
                            }
                            alt={produit.name}
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </td>
                        <td style={{ padding: "12px", fontWeight: 600 }}>
                          {produit.name}
                        </td>
                        <td style={{ padding: "12px", color: "#6b7280", fontSize: "0.875rem" }}>
                          {(produit.description || "Aucune description")}
                        </td>
                        <td style={{ padding: "12px", color: "#059669", fontWeight: 600 }}>
                          {produit.unit_price.toLocaleString()} AR
                        </td>
                        <td style={{ padding: "12px", fontWeight: 500 }}>
                          {produit.available_quantity}
                        </td>
                        <td style={{ padding: "12px", display: "flex", gap: 30 }}>
                          <button
                            onClick={() => openEditModal(produit)}
                            className="img-btn-modif"
                            title= "Modifier"
                          >
                            <i className="fas fa-edit" style={{color: "blue"}}></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(id)}
                            title="Supprimer"
                            className="img-btn-sup"
                          >
                            <i className="fas fa-trash" style={{color: "red"}}></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
            </div>
          )}
          
        </div>

        <div className="page-nav">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
            title="Precedent"
          >
            <i className="fa-solid fa-backward-fast"></i>
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
            title="Suivant"
          >
            <i className="fa-solid fa-forward-fast"></i>
          </button>
        </div>
      </DashboardLayout>
    </>
  );
}
export default Produits;