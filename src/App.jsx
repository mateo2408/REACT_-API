import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Pets from './components/Pets';
import Owners from './components/Owners';
import Appointments from './components/Appointments';
import Inventory from './components/Inventory';
import { Stethoscope } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
