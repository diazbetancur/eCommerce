// Cliente HTTP genérico
export class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async get(endpoint, options = {}) {
    // ...implementación genérica GET
  }
  async post(endpoint, data, options = {}) {
    // ...implementación genérica POST
  }
  // ...otros métodos (put, delete, etc)
}
