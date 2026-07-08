// URL base de la API obtenida de variables de entorno
// Si no se define, usa una ruta relativa para funcionar en despliegues con proxy o mismo origen
const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

// Servicio centralizado para todas las llamadas a la API
// Maneja autenticación, tokens y comunicación con el servidor
class ApiService {
  // Obtiene el token de autenticación almacenado en el navegador
  getToken() {
    return localStorage.getItem('vetcore_token');
  }

  // Guarda o elimina el token de autenticación en el almacenamiento local
  setToken(token) {
    if (token) {
      localStorage.setItem('vetcore_token', token);
    } else {
      localStorage.removeItem('vetcore_token');
    }
  }

  // Recupera los datos del usuario autenticado desde el almacenamiento local
  getUser() {
    const user = localStorage.getItem('vetcore_user');
    return user ? JSON.parse(user) : null;
  }

  // Guarda o elimina los datos del usuario en el almacenamiento local
  setUser(user) {
    if (user) {
      localStorage.setItem('vetcore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vetcore_user');
    }
  }

  // Realiza una petición HTTP genérica a la API
  // Incluye automáticamente el token de autenticación en los headers
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const isAuthEndpoint = endpoint.startsWith('/auth/');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token && !isAuthEndpoint) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Manejar respuestas sin contenido (204 No Content)
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición del servidor');
      }

      return data;
    } catch (error) {
      console.error(`Error en API request [${endpoint}]:`, error);
      throw new Error(error?.message || 'No se pudo conectar con la API');
    }
  }

  // Inicia sesión del usuario con email y contraseña
  // Guarda el token y datos del usuario si es exitoso
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data && data.token) {
      this.setToken(data.token);
      this.setUser(data.user);
    }
    return data;
  }

  // Cierra la sesión del usuario limpiando token y datos almacenados
  logout() {
    this.setToken(null);
    this.setUser(null);
  }

  // Obtiene el resumen general del dashboard con estadísticas del sistema
  getDashboardSummary() {
    return this.request('/dashboard/summary');
  }

  // Obtiene la lista de todas las mascotas registradas
  getPets() {
    return this.request('/pets');
  }

  // Obtiene la lista de todos los dueños/clientes registrados
  getOwners() {
    return this.request('/owners');
  }

  // Obtiene la lista de todas las citas médicas programadas
  getAppointments() {
    return this.request('/appointments');
  }

  getInventory() {
    return this.request('/inventory');
  }
}

export const api = new ApiService();
