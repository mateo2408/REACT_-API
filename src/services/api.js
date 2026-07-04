const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  getToken() {
    return localStorage.getItem('vetcore_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('vetcore_token', token);
    } else {
      localStorage.removeItem('vetcore_token');
    }
  }

  getUser() {
    const user = localStorage.getItem('vetcore_user');
    return user ? JSON.parse(user) : null;
  }

  setUser(user) {
    if (user) {
      localStorage.setItem('vetcore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vetcore_user');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
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
      throw error;
    }
  }

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

  logout() {
    this.setToken(null);
    this.setUser(null);
  }

  getDashboardSummary() {
    return this.request('/dashboard/summary');
  }

  getPets() {
    return this.request('/pets');
  }

  getOwners() {
    return this.request('/owners');
  }

  getAppointments() {
    return this.request('/appointments');
  }

  getInventory() {
    return this.request('/inventory');
  }
}

export const api = new ApiService();
