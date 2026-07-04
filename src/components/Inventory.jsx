import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Package, AlertTriangle, CheckCircle, TrendingDown, DollarSign } from 'lucide-react';
import './ListCommon.css';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await api.getInventory();
        setItems(data || []);
      } catch (err) {
        setError('Error al obtener la lista de inventario.');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) ||
      item.type?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando inventario de medicamentos e insumos...</p>
      </div>
    );
  }

  return (
    <div className="list-view animate-fade-in">
      <div className="view-header">
        <div>
          <h1>Inventario Clínico</h1>
          <p>Control de medicamentos, vacunas y suministros médicos.</p>
        </div>
        
        <div className="search-bar glass">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre de producto o tipo..." 
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
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isLowStock = item.stock <= item.minStock;
            return (
              <div key={item._id} className={`detail-card glass ${isLowStock ? 'alert-border' : ''}`}>
                <div className="card-top">
                  <div className={`avatar-glow ${isLowStock ? 'warning-glow' : ''}`}>
                    <Package size={24} className="avatar-icon" />
                  </div>
                  <div>
                    <h3>{item.name}</h3>
                    <span className="badge badge-info">{item.type}</span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="inventory-stats">
                    <div className="stock-info">
                      <span className="label">Stock Actual:</span>
                      <span className={`stock-val ${isLowStock ? 'text-warning' : 'text-primary'}`}>
                        {item.stock} {item.unit || 'uds'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Stock Mínimo:</span>
                      <span className="value">{item.minStock} {item.unit || 'uds'}</span>
                    </div>

                    {item.price && (
                      <div className="info-row price-row">
                        <DollarSign size={14} className="text-muted" />
                        <span className="value"><strong>Precio:</strong> ${item.price.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {isLowStock ? (
                    <div className="stock-status-alert low">
                      <TrendingDown size={14} />
                      <span>Reabastecimiento Recomendado</span>
                    </div>
                  ) : (
                    <div className="stock-status-alert optimal">
                      <CheckCircle size={14} />
                      <span>Stock Óptimo</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-results glass">
            <p>No se encontraron productos en el inventario.</p>
          </div>
        )}
      </div>
    </div>
  );
}
