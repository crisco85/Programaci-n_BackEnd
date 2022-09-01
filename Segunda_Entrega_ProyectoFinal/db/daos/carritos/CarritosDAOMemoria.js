const ContenedorMemoria = require('../../containers/containerMemoria')

class CarritosDAOMemoria extends ContenedorMemoria {
  constructor() {
    super('carrito')
  }
}

module.exports = CarritosDAOMemoria