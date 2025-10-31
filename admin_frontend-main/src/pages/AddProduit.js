import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

function AddProduit() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [quantite, setQuantite] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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
        headers: { "Content-Type": "multipart/form-data" }
      });
      setIsSuccess(true);
      setMessage("Produit créé avec succès 🎯");
      setNom("");
      setDescription("");
      setPrix("");
      setQuantite("");
      setImage(null);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage("Erreur lors de la création du produit ❌");
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: { marginBottom: '32px' },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1.125rem',
      marginBottom: '32px'
    },
    form: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '500px',
      margin: '0 auto',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6'
    },
    input: {
      padding: '12px 16px',
      fontSize: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '16px',
      width: '100%',
      outline: 'none'
    },
    textarea: {
      padding: '12px 16px',
      fontSize: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '16px',
      width: '100%',
      minHeight: '100px',
      resize: 'vertical',
      outline: 'none'
    },
    button: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.2s ease-in-out'
    },
    message: {
      textAlign: 'center',
      fontWeight: '600',
      color: isSuccess ? '#059669' : '#dc2626',
      marginBottom: '24px'
    }
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Ajouter un produit</h1>
          <p style={styles.subtitle}>Ajoutez un nouveau produit au catalogue</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
          {message && <div style={styles.message}>{message}</div>}
          <input
            type="text"
            placeholder="Nom du produit"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            required
          />
          <input
            type="number"
            placeholder="Prix unitaire (en Ar)"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Quantité disponible"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Ajouter</button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default AddProduit;
