const ContenedorArchivo = require('../../containers/containerArchivo.js');

class ProductosDAOArchivo extends ContenedorArchivo {
  constructor() {
    super('./productos.json')
  }
}

module.exports = ProductosDAOArchivo