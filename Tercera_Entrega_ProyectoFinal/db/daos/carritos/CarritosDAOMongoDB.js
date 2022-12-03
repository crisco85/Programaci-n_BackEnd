const ContenedorMongoDB = require('../../containers/containerMongoDb');
const mongoose = require('mongoose');
const { dbLogger } = require('../../../utils/log4jsConfig');
const { normalizeCartData } = require('../../DTOs/cartDTO');
let carritosDAOMongoDBInstance = null;

class CarritosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, url) {
    super(collectionName, schema, url)
  }

  static getInstance(collectionName, schema, url) {
    if(!carritosDAOMongoDBInstance) {
      carritosDAOMongoDBInstance = new CarritosDAOMongoDB(collectionName, schema, url)
    }

    return carritosDAOMongoDBInstance
  }

  async getCartByUserId(id){
    try{
        const items = await this.collection.find({user: id})

        if(items){
            return normalizeCartData(items)
        }
        throw new Error(`No existe el ID ${id}`)

    } catch(error) {
        throw new Error(`Error en lectura de arvhivo en funcion getById. ${error.message}`)
    }
  }
  
  async modifyById(id, newData){
    try{
        await this.collection.updateOne({_id: mongoose.Types.ObjectId(id)}, {
            $push:{productos: newData}
        })
        return {message:`Se ha modificado el objeto con id ${id}`}
    } catch (error){
        throw new Error('No existe el ID')
    }
  }
}

module.exports = CarritosDAOMongoDB