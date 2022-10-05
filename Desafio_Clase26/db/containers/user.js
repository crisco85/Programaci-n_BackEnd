const mongoose = require('mongoose')

class User {

    constructor(collectionName, schema, url) {
        this.collection = mongoose.model(collectionName, schema )
        this.url = url
        this.mongoConnect()
    }

    async mongoConnect() {
        try {
            await mongoose.connect(this.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log(`[USER] Conectado a MongoDB`)
        }
        catch (error) {
            throw new Error(`Error en conexion a mongoDB ${console.log(error)}`)
        }
    }
}

module.exports = User