import { useState, useEffect } from 'react';
import { api } from './services/api';
import Dashboard from './components/Dashboard';
import Pets from './components/Pets';
import Owners from './components/Owners';
import Appointments from './components/Appointments';
import Inventory from './components/Inventory';
import Login from './components/Login';
import { Stethoscope } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(() => api.getUser());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const autoLogin = async () => {
      try {
        if (api.getToken()) {
          setUser(api.getUser());
          return;
        }

        // Intentar iniciar sesión automáticamente con credenciales de administrador por defecto
        const data = await api.login('admin@vet.com', 'Admin123*');
        setUser(data.user);
      } catch (err) {
        console.error('Error en el auto-login:', err);
        setAuthError(`Error de autenticación automática con la API: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };
    autoLogin();
  }, []);

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    setAuthError('');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
          Conectando automáticamente con la API...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        {authError ? (
          <div style={{ textAlign: 'center', padding: '24px 24px 0' }}>
            <h2 style={{ color: '#ef4444' }}>Error de Conexión</h2>
            <p>{authError}</p>
          </div>
        ) : null}
        <Login onLoginSuccess={handleLoginSuccess} externalError={authError} />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'pets':
        return <Pets />;
      case 'owners':
        return <Owners />;
      case 'appointments':
        return <Appointments />;
      case 'inventory':
        return <Inventory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="simple-app-shell">
      {/* Top Simple Menu Header */}
      <header className="simple-header glass">
        <div className="header-brand">
          <Stethoscope className="logo-icon" size={24} />
          <h2>VetCore Portal</h2>
        </div>
        <nav className="simple-menu">
          <button 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Resumen (CORE)
          </button>
          <button 
            className={`menu-item ${activeTab === 'pets' ? 'active' : ''}`}
            onClick={() => setActiveTab('pets')}
          >
            Mascotas
          </button>
          <button 
            className={`menu-item ${activeTab === 'owners' ? 'active' : ''}`}
            onClick={() => setActiveTab('owners')}
          >
            Clientes
          </button>
          <button 
            className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Citas
          </button>
          <button 
            className={`menu-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventario
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="simple-content">
        {renderActiveView()}
      </main>
    </div>
  );
}
