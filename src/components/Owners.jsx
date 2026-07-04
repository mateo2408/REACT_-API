import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, User, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';
import './ListCommon.css';

export default function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const data = await api.getOwners();
        setOwners(data || []);
      } catch (err) {
        setError('Error al obtener la lista de clientes.');
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  const filteredOwners = owners.filter((owner) => {
    const query = searchQuery.toLowerCase();
    return (
      owner.fullName?.toLowerCase().includes(query) ||
      owner.email?.toLowerCase().includes(query) ||
      owner.phone?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="list-view animate-fade-in">
      <div className="view-header">
        <div>
          <h1>Clientes / Dueños</h1>
          <p>Registro de propietarios de mascotas en la clínica.</p>
        </div>
        
        <div className="search-bar glass">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo, teléfono..." 
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
        {filteredOwners.length > 0 ? (
          filteredOwners.map((owner) => (
            <div key={owner._id} className="detail-card glass">
              <div className="card-top">
                <div className="avatar-glow">
                  <User size={24} className="avatar-icon" />
                </div>
                <div>
                  <h3>{owner.fullName}</h3>
                  <span className="badge badge-success">Cliente Activo</span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="contact-info-list">
                  {owner.email && (
                    <div className="contact-row">
                      <Mail size={16} className="text-muted" />
                      <span>{owner.email}</span>
                    </div>
                  )}
                  {owner.phone && (
                    <div className="contact-row">
                      <Phone size={16} className="text-muted" />
                      <span>{owner.phone}</span>
                    </div>
                  )}
                  {owner.address && (
                    <div className="contact-row">
                      <MapPin size={16} className="text-muted" />
                      <span>{owner.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-results glass">
            <p>No se encontraron clientes que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
