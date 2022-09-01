const { ClientSession } = require('mongodb')
const mongoose = require('mongoose')

class containerMongoDB {

    constructor(collectionName, schema, uri) {
        this.collection = mongoose.model(collectionName, schema)
        this.uri = uri
        this.mongoConnect()
    }

    async mongoConnect() {
        try {
            await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log("Conectado a MongoDB")
        }
        catch (error) {
            throw new Error(`Error en conexion a mongoDB ${console.log(error)}`)
        }
    }

    async save(nuevoObjeto){
        try{
            nuevoObjeto.timestamp = Date.now()
            const item = await this.collection.create(nuevoObjeto)
            return item
        } catch (error){
            throw new Error(`Error en la creacion de la coleccion. ${error}`)
        }
    }

    async getById(id){
        try{
            const items = await this.collection.findById(id)

            if(items){
                return items
            }
            throw new Error(`No existe el ID ${id}`)

        } catch(error) {
            throw new Error(`Error en lectura de arvhivo en funcion getById. ${error.message}`)
        }
    }

    async getAll(cartId) {
        try{
            const items = await this.collection.find()
            
            if(cartId === null){
                return items
            }
            const selectedElement = items.find(element => element._id.toString() === (cartId))
                        
            if (selectedElement){
                return selectedElement.productos
            }
            
            throw new Error(`No existe el ID ${cartId}`)

        }catch(e){
            throw new Error(e)
        }
    }

    async modifyById(id, newData){
        if(this.collection.modelName == 'producto'){
            try{
                await this.collection.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {
                    nombre: newData.nombre,
                    descripcion: newData.descripcion,
                    codigo: newData.codigo,
                    foto: newData.foto,
                    precio: newData.precio,
                    stock: newData.stock,
                    timestamp: Date.now()
                })
                return {message:`Se ha modificado el objeto con id ${id}`}
            } catch (error){
                throw new Error('No existe el ID de producto')
            }
        } else if (this.collection.modelName == 'carrito'){
            try{
                await this.collection.updateOne({_id: mongoose.Types.ObjectId(id)}, {
                     $push:{productos:newData}
                })
                return {message:`Se ha modificado el objeto con id ${id}`}
            } catch (error){
                throw new Error('No existe el ID')
            }
        } else {
            throw new Error('No existe la BDD')
        }
    }
   
    async deleteById(general_id, prod_id){
        if ((this.collection.modelName == 'producto') || ((this.collection.modelName == 'carrito') && (prod_id == null))){
            try{
                const success = await this.collection.deleteOne({_id: mongoose.Types.ObjectId(general_id)})

                if(success.modifiedCount != 0){
                    return {message: `Se ha eliminado el producto con id ${general_id}`}             
                } else {
                    throw new Error(`Error en la busqueda en la BDD`)
                }

            } catch (error){
                throw new Error(`Error al borrar el objeto con id ${general_id}. ${error}`)
            }

        } else if(this.collection.modelName == 'carrito'){

            try{
                const success = await this.collection.updateMany(
                    {_id: mongoose.Types.ObjectId(general_id) }, 
                    { $pull: { productos: {id: Number(prod_id)}}}
                )

                if(success.modifiedCount != 0){
                    return {message: `Se ha eliminado el producto ${prod_id} del carrito con id ${general_id}`}             
                } else {
                    throw new Error(`No se encontro el ID de Producto ${prod_id}`)
                }

            } catch (error){
                throw new Error(`Error al borrar el objeto con id ${general_id}. ${error}`)
            }
        } else {
            throw new Error('No existe la BDD')
        }
    }
}
module.exports = containerMongoDB