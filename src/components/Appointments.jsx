import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Calendar, User, Clock, Stethoscope, AlertTriangle, MessageSquare } from 'lucide-react';
import './ListCommon.css';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await api.getAppointments();
        setAppointments(data || []);
      } catch (err) {
        setError('Error al obtener la lista de citas.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((app) => {
    const query = searchQuery.toLowerCase();
    return (
      app.petId?.name?.toLowerCase().includes(query) ||
      app.veterinarianName?.toLowerCase().includes(query) ||
      app.reason?.toLowerCase().includes(query) ||
      app.status?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando agenda de citas...</p>
      </div>
    );
  }

  return (
    <div className="list-view animate-fade-in">
      <div className="view-header">
        <div>
          <h1>Citas Médicas</h1>
          <p>Agenda y programación de consultas veterinarias.</p>
        </div>
        
        <div className="search-bar glass">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por mascota, veterinario, motivo o estado..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-banner glass">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="cards-grid">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app) => {
            const appDate = new Date(app.dateTime);
            return (
              <div key={app._id} className="detail-card glass">
                <div className="card-top">
                  <div className="avatar-glow">
                    <Calendar size={24} className="avatar-icon" />
                  </div>
                  <div>
                    <h3>{app.petId?.name || 'Mascota'}</h3>
                    <span className={`badge ${app.status === 'programada' ? 'badge-success' : 'badge-info'}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="appointment-details-list">
                    <div className="info-row">
                      <Clock size={16} className="text-muted" />
                      <span className="value">
                        {appDate.toLocaleDateString('es-ES')} - {appDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="info-row">
                      <Stethoscope size={16} className="text-muted" />
                      <span className="value">
                        <strong>Vet:</strong> {app.veterinarianName || 'Por asignar'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Motivo:</span>
                      <span className="value">{app.reason}</span>
                    </div>

                    {app.notes && (
                      <div className="notes-section">
                        <div className="notes-header">
                          <MessageSquare size={14} />
                          <h5>Notas de la Cita</h5>
                        </div>
                        <p>{app.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-results glass">
            <p>No se encontraron citas que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
