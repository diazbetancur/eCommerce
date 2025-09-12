// Servicio de autenticación desacoplado
import { CLIENT_CONFIG } from '../config/client.config';

export class AuthService {
  constructor() {
    this.apiUrl = CLIENT_CONFIG.settings.apiUrl;
  }

  async login(email, password) {
    // Ejemplo de login usando la URL del cliente
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }

  async logout() {
    // Implementa logout si es necesario
  }

  async getCurrentUser() {
    // Implementa obtención de usuario actual si es necesario
  }
}
