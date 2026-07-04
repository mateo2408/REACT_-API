import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, PawPrint, Calendar, Phone, FileText, AlertTriangle } from 'lucide-react';
import './ListCommon.css';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await api.getPets();
        setPets(data || []);
      } catch (err) {
        setError('Error al obtener la lista de mascotas.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const filteredPets = pets.filter((pet) => {
    const query = searchQuery.toLowerCase();
    return (
      pet.name?.toLowerCase().includes(query) ||
      pet.species?.toLowerCase().includes(query) ||
      pet.breed?.toLowerCase().includes(query) ||
      pet.ownerId?.fullName?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando mascotas...</p>
      </div>
    );
  }

  return (
    <div className="list-view animate-fade-in">
      <div className="view-header">
        <div>
          <h1>Mascotas</h1>
          <p>Pacientes registrados en el sistema veterinario.</p>
        </div>
        
        <div className="search-bar glass">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, especie, raza o dueño..." 
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
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <div key={pet._id} className="detail-card glass">
              <div className="card-top">
                <div className="avatar-glow">
                  <PawPrint size={24} className="avatar-icon" />
                </div>
                <div>
                  <h3>{pet.name}</h3>
                  <span className="badge badge-info">{pet.species}</span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="label">Raza:</span>
                  <span className="value">{pet.breed || 'Sin especificar'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Sexo:</span>
                  <span className="value capitalize">{pet.sex}</span>
                </div>
                <div className="info-row">
                  <span className="label">F. Nacimiento:</span>
                  <span className="value">
                    {pet.birthDate ? new Date(pet.birthDate).toLocaleDateString('es-ES') : 'Desconocida'}
                  </span>
                </div>
                
                {pet.ownerId && (
                  <div className="owner-section">
                    <h4>Propietario</h4>
                    <div className="info-row">
                      <span className="label">Nombre:</span>
                      <span className="value">{pet.ownerId.fullName}</span>
                    </div>
                    {pet.ownerId.phone && (
                      <div className="info-row">
                        <Phone size={14} className="text-muted" />
                        <span className="value">{pet.ownerId.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {pet.notes && (
                  <div className="notes-section">
                    <div className="notes-header">
                      <FileText size={14} />
                      <h5>Notas Clínicas</h5>
                    </div>
                    <p>{pet.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-results glass">
            <p>No se encontraron mascotas que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
