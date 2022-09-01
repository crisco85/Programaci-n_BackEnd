const ContenedorMemoria = require('../../containers/containerMemoria')

class ProductosDAOMemoria extends ContenedorMemoria {
  constructor() {
    super('producto')
  }
}

module.exports = ProductosDAOMemoria