// Componente Dashboard
// Muestra el resumen general del sistema con estadísticas y alertas
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Users, PawPrint, Calendar, ClipboardList, 
  ShieldAlert, Activity, Package, AlertTriangle, 
  CheckCircle, Info
} from 'lucide-react';
import './Dashboard.css';

// Componente Dashboard: Panel principal de control
// Muestra estadísticas, citas recientes y alertas del sistema
export default function Dashboard() {
  const emptyDashboardData = {
    counts: {},
    recentAppointments: [],
    recentPets: [],
    activeOutbreaks: [],
    diseasesAtRisk: [],
    epidemicSummary: '',
    recommendations: [],
    activeAlerts: [],
    inventorySummary: {},
  };

  const [data, setData] = useState(emptyDashboardData);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState('');

  // Al cargar el componente, obtiene el resumen del dashboard de la API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summary = await api.getDashboardSummary();
        setData(summary || emptyDashboardData);
        setWarning('');
      } catch (err) {
        setData(emptyDashboardData);
        setWarning('No se pudo conectar con la API. Se muestra el panel sin datos en vivo.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando información del sistema...</p>
      </div>
    );
  }

  const { 
    counts = {}, 
    recentAppointments = [], 
    recentPets = [], 
    activeOutbreaks = [], 
    diseasesAtRisk = [],
    epidemicSummary = '',
    recommendations = [],
    activeAlerts = [],
    inventorySummary = {}
  } = data || {};

  return (
    <div className="dashboard-view animate-fade-in">
      {warning ? (
        <div className="error-banner glass" style={{ marginBottom: '16px' }}>
          <AlertTriangle size={20} />
          <span>{warning}</span>
        </div>
      ) : null}

      <div className="dashboard-welcome">
        <h1>Dashboard General</h1>
        <p>Resumen del estado clínico y operativo de la veterinaria.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon-wrapper blue">
            <PawPrint size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Mascotas</span>
            <span className="stat-value">{counts.pets || 0}</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon-wrapper emerald">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Clientes / Dueños</span>
            <span className="stat-value">{counts.owners || 0}</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon-wrapper violet">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Citas Registradas</span>
            <span className="stat-value">{counts.appointments || 0}</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon-wrapper gold">
            <ClipboardList size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Historias Clínicas</span>
            <span className="stat-value">{counts.records || 0}</span>
          </div>
        </div>
      </div>

      {/* Epidemic Alerts Section (Core Logic) */}
      <div className="dashboard-section alerts-section glass">
        <div className="section-header">
          <div className="header-title">
            <Activity className="header-icon pulse-animation" size={20} />
            <h2>Vigilancia Epidemiológica (CORE)</h2>
          </div>
          <span className="badge badge-info">Sistema Inteligente</span>
        </div>
        
        <div className="alerts-content">
          <div className="epidemic-status">
            <p className="summary-text">
              <strong>Estado Actual:</strong> {typeof epidemicSummary === 'object' && epidemicSummary !== null ? (
                `Se registran ${epidemicSummary.totalCasesRecorded || 0} casos en total de ${epidemicSummary.totalDiseases || 0} enfermedades analizadas. Hay ${epidemicSummary.activeOutbreaks || 0} brotes activos.`
              ) : (epidemicSummary || 'Cargando análisis...')}
            </p>
            
            {activeAlerts.length > 0 ? (
              <div className="active-alerts-list">
                {activeAlerts.map((alert, idx) => (
                  <div key={idx} className="alert-item error">
                    <ShieldAlert size={18} />
                    <span>{alert.message || alert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert-item success">
                <CheckCircle size={18} />
                <span>No se detectan brotes activos ni alertas en la zona de cobertura.</span>
              </div>
            )}
          </div>

          <div className="epidemic-details-grid">
            <div className="epidemic-subcard">
              <h3>Brotes Clasificados</h3>
              {activeOutbreaks.length > 0 ? (
                <ul>
                  {activeOutbreaks.map((outbreak, idx) => (
                    <li key={idx} className="outbreak-item text-danger">
                      <span className="dot danger"></span>
                      {outbreak.disease || outbreak}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">Sin brotes detectados</p>
              )}
            </div>

            <div className="epidemic-subcard">
              <h3>Enfermedades en Riesgo</h3>
              {diseasesAtRisk.length > 0 ? (
                <ul>
                  {diseasesAtRisk.map((disease, idx) => (
                    <li key={idx} className="outbreak-item text-warning">
                      <span className="dot warning"></span>
                      {disease.disease || disease}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">Sin riesgos potenciales de momento</p>
              )}
            </div>

            <div className="epidemic-subcard full-width">
              <h3>Recomendaciones del Sistema</h3>
              {recommendations.length > 0 ? (
                <div className="recommendations-list">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="rec-item">
                      <Info size={16} className="text-secondary" />
                      <p>
                        {typeof rec === 'object' && rec !== null ? (
                          <>
                            <span 
                              className={`badge ${rec.priority === 'URGENT' ? 'badge-danger' : 'badge-warning'}`} 
                              style={{ marginRight: '8px', display: 'inline-block' }}
                            >
                              {rec.priority}
                            </span>
                            {rec.action}
                          </>
                        ) : rec}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No hay recomendaciones adicionales actuales.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid for lists */}
      <div className="dashboard-grid">
        {/* Recent Appointments */}
        <div className="grid-card glass">
          <div className="section-header">
            <h2>Próximas Citas</h2>
            <Calendar size={18} className="text-muted" />
          </div>
          <div className="list-wrapper">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((app) => (
                <div key={app._id} className="list-item">
                  <div className="item-details">
                    <h4>{app.petId?.name || 'Mascota'}</h4>
                    <p>{app.reason}</p>
                    <span className="item-date">
                      {new Date(app.dateTime).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span className={`badge ${app.status === 'programada' ? 'badge-success' : 'badge-info'}`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">No hay citas registradas recientemente.</p>
            )}
          </div>
        </div>

        {/* Recent Pets */}
        <div className="grid-card glass">
          <div className="section-header">
            <h2>Mascotas Recientes</h2>
            <PawPrint size={18} className="text-muted" />
          </div>
          <div className="list-wrapper">
            {recentPets.length > 0 ? (
              recentPets.map((pet) => (
                <div key={pet._id} className="list-item">
                  <div className="item-details">
                    <h4>{pet.name}</h4>
                    <p>{pet.species} • {pet.breed || 'Sin Raza'}</p>
                    <span className="item-owner">Dueño: {pet.ownerId?.fullName || 'Desconocido'}</span>
                  </div>
                  <span className="badge badge-info">
                    {pet.sex}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">No hay mascotas registradas recientemente.</p>
            )}
          </div>
        </div>
      </div>

      {/* Inventory status footer */}
      {inventorySummary && (
        <div className="dashboard-footer-card glass">
          <div className="footer-card-header">
            <div className="title-wrapper">
              <Package size={20} className="text-secondary" />
              <h3>Resumen de Inventario</h3>
            </div>
            <div className="stats-pills">
              <span className="pill warning">Bajo Stock: {inventorySummary.lowStockCount || 0}</span>
              <span className="pill info">Total Items: {inventorySummary.totalItems || 0}</span>
            </div>
          </div>
          {inventorySummary.lowStockCount > 0 && (
            <div className="low-stock-alert">
              <AlertTriangle className="text-warning" size={16} />
              <span>Hay insumos médicos con bajo stock. Por favor revisa el módulo de inventario.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
