const ContenedorArchivo = require('../../containers/containerArchivo')

class ProductosDAOArchivo extends ContenedorArchivo {
  constructor() {
    super('./productos.json')
  }
}

module.exports = ProductosDAOArchivo