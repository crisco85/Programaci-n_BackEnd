const ContenedorMongoDB = require('../../containers/containerMongoDb');

class ProductosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, uri) {
    super(collectionName, schema, uri);
  }
}

module.exports = ProductosDAOMongoDB;