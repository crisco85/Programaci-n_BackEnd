const ContenedorMongoDB = require('../../containers/containerMongoDb');
const { normalizeUserData } = require('../../DTOs/userDTO');
let usuariosDAOMongoDBInstance = null;

class UsuariosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, url) {
    super(collectionName, schema, url)
  }

  static getInstance(collectionName, schema, url) {
    if(!usuariosDAOMongoDBInstance) {
      usuariosDAOMongoDBInstance = new UsuariosDAOMongoDB(collectionName, schema, url)
    }
    return usuariosDAOMongoDBInstance
  }

  async findUser(username){
    try{
      const user = await this.collection.findOne({ username: username.username })
      if(user){
        return normalizeUserData(user)
      }
    } catch(error) {
        throw new Error(`Error en la busqueda del Usuario (findUser()). ${error.message}`)
    }
  }
}

module.exports = UsuariosDAOMongoDB