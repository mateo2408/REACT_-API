import { useState } from 'react';
import { api } from '../services/api';
import { Mail, Lock, Stethoscope, AlertCircle } from 'lucide-react';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@vet.com');
  const [password, setPassword] = useState('Admin123*');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(email, password);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Credenciales inválidas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass">
        <div className="login-header">
          <div className="brand-logo-glow">
            <Stethoscope className="brand-icon" size={32} />
          </div>
          <h1>VetCore</h1>
          <p>Sistema de Gestión Veterinaria</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Iniciando Sesión...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-demo-helper">
          <h3>Credenciales de Demostración:</h3>
          <div className="demo-credentials">
            <div className="demo-item" onClick={() => { setEmail('admin@vet.com'); setPassword('Admin123*'); }}>
              <strong>Admin:</strong> admin@vet.com / Admin123*
            </div>
            <div className="demo-item" onClick={() => { setEmail('recepcion@vet.com'); setPassword('Admin123*'); }}>
              <strong>Recepción:</strong> recepcion@vet.com / Admin123*
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
