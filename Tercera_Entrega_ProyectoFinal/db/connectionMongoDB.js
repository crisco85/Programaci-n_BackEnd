const mongoose = require('mongoose');
const { dbLogger } = require('../utils/log4jsConfig');
let isConnected = false;

const checkConnection = async (url) => {
    if(!isConnected){
        try {
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })

            dbLogger.info("Conectado a DB: Mongo");
            isConnected = true;
        }
        catch (error) {
            throw new Error(`Error en conexion a MongoDB ${error}`);
        }
    }
    return
}

module.exports = { checkConnection };