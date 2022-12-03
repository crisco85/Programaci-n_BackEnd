const ContenedorArchivo = require('../../containers/containerArchivo')

class CarritosDAOArchivo extends ContenedorArchivo {
  constructor() {
    super('./carritos.json')
  }
}

module.exports = CarritosDAOArchivo