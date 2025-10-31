// src/pages/Investisseurs.js
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

function Investisseurs() {
  const [investisseurs, setInvestisseurs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchInvestisseurs = async () => {
      try {
        const { data } = await api.get('investisseurs');
        setInvestisseurs(data);
      } catch (error) {
        setError('Erreur lors du chargement des investisseurs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvestisseurs();
  }, []);

  const toggleActif = async (id, actuel) => {
    setLoadingId(id);
    try {
      await api.put(`investisseurs/${id}`, { actif: actuel ? 0 : 1 });
      setInvestisseurs((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, actif: actuel ? 0 : 1 } : inv
        )
      );
    } catch {
      setError('Erreur lors de la modification du statut');
    } finally {
      setLoadingId(null);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      marginBottom: '32px',
      animation: 'fadeIn 0.8s ease-out'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1.125rem'
    },
    alertError: {
      marginBottom: '24px',
      padding: '16px',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fdf2f8 100%)',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      animation: 'slideIn 0.5s ease-out'
    },
    alertContent: {
      display: 'flex',
      alignItems: 'center'
    },
    alertDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      marginRight: '12px',
      backgroundColor: '#ef4444',
      animation: 'pulse 2s infinite'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #7c3aed',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '32px'
    },
    statCard: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #f3f4f6',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '500'
    },
    tableContainer: {
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    thead: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      color: '#ffffff'
    },
    th: {
      padding: '20px 16px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    tbody: {
      background: '#ffffff'
    },
    tr: {
      borderBottom: '1px solid #f3f4f6',
      transition: 'all 0.2s ease-in-out'
    },
    trHover: {
      backgroundColor: '#f8fafc',
      transform: 'scale(1.01)'
    },
    td: {
      padding: '16px',
      fontSize: '0.875rem',
      color: '#374151'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '1rem',
      marginRight: '12px'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center'
    },
    userName: {
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '2px'
    },
    userEmail: {
      color: '#6b7280',
      fontSize: '0.8rem'
    },
    badge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    badgeActive: {
      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      color: '#065f46'
    },
    badgeInactive: {
      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      color: '#991b1b'
    },
    actionButton: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    buttonActivate: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
    },
    buttonDeactivate: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
    },
    buttonDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed'
    },
    miniSpinner: {
      width: '14px',
      height: '14px',
      border: '2px solid #ffffff',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    emptyState: {
      textAlign: 'center',
      padding: '64px 16px',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    emptyIcon: {
      width: '96px',
      height: '96px',
      background: '#f3f4f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '3rem'
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    emptyDescription: {
      color: '#6b7280'
    }
  };

  const totalInvestisseurs = investisseurs.length;
  const investisseursActifs = investisseurs.filter(inv => inv.actif).length;
  const investisseursInactifs = totalInvestisseurs - investisseursActifs;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Investisseurs</h1>
          <p style={styles.subtitle}>Gérez votre communauté d'investisseurs</p>
        </div>

        {error && (
          <div style={styles.alertError}>
            <div style={styles.alertContent}>
              <div style={styles.alertDot}></div>
              <p style={{color: '#991b1b', fontWeight: '500', margin: 0}}>{error}</p>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: '#7c3aed'}}>{totalInvestisseurs}</div>
            <div style={styles.statLabel}>Total investisseurs</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: '#059669'}}>{investisseursActifs}</div>
            <div style={styles.statLabel}>Actifs</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: '#dc2626'}}>{investisseursInactifs}</div>
            <div style={styles.statLabel}>Inactifs</div>
          </div>
        </div>

        {investisseurs.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Investisseur</th>
                  <th style={styles.th}>Inscrit le</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {investisseurs.map((inv) => (
                  <tr 
                    key={inv.id} 
                    style={styles.tr}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, {...styles.tr, ...styles.trHover})}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.tr)}
                  >
                    <td style={styles.td}>
                      <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                          {inv.nom?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={styles.userName}>{inv.nom}</div>
                          <div style={styles.userEmail}>{inv.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {new Date(inv.date_inscription).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        ...(inv.actif ? styles.badgeActive : styles.badgeInactive)
                      }}>
                        {inv.actif ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => toggleActif(inv.id, inv.actif)}
                        disabled={loadingId === inv.id}
                        style={{
                          ...styles.actionButton,
                          ...(inv.actif ? styles.buttonDeactivate : styles.buttonActivate),
                          ...(loadingId === inv.id ? styles.buttonDisabled : {})
                        }}
                      >
                        {loadingId === inv.id ? (
                          <div style={styles.miniSpinner}></div>
                        ) : (
                          <>
                            <span>{inv.actif ? "🔒" : "🔓"}</span>
                            {inv.actif ? "Désactiver" : "Activer"}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <h3 style={styles.emptyTitle}>Aucun investisseur trouvé</h3>
            <p style={styles.emptyDescription}>Les investisseurs apparaîtront ici une fois qu'ils se seront inscrits</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
}

export default Investisseurs;