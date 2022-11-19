const authorizationLevel = 0;
const { errorLogger } = require('../utils/log4jsConfig');

const { getItemById, getAllItems, addItem, editItem, deleteItem } = require('../services/productServices');

const getProductById = async (req, res) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){

        const productId = req.params.id;

        if(productId){
            try{
                const mData = await getItemById(productId);
                return res.status(200).json(mData);
            } catch (error) {
                errorLogger.error(error);
                return res.status(500).json(error.message);
            }
        }
        try{
            const mData = await getAllItems();
            return res.status(200).json(mData);
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:{url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`}})
    }
}

const addProduct = async (req, res) => {
    if(authorizationLevel == 0){

        const newProduct = req.body;

        try{
            const answer = await addItem(newProduct);
            return res.status(201).json(answer);
        } catch (error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
}

const editProduct = async (req, res) => {
    if(authorizationLevel == 0){

        const productId = req.params.id;
        const newProduct = req.body;

        try {
            // Data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
            const answer = await editItem(productId, newProduct);
            return res.status(201).json(answer);
        } catch(error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
}

const deleteProduct = async (req, res) => {
    if(authorizationLevel == 0){

        const productId = req.params.id;

        try {
            const answer = await deleteItem(productId, null);
            return res.status(201).json(answer);
        } catch(error) {
            errorLogger.error(error);
            return res.status(500).json(error.message);
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
}

module.exports = { getProductById, addProduct, editProduct, deleteProduct }