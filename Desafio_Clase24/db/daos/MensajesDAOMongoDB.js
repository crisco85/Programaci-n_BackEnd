const ContenedorMongoDB = require('../containers/containerMongoDb');

class CarritosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, url) {
    super(collectionName, schema, url);
  }
}

module.exports = CarritosDAOMongoDB;