const express = require('express')
const {Router} = express
const getStorage = require('../db/daos')
const carritoRouter = Router()

const authorizationLevel = 0

const { carts: storage } = getStorage()


//#region Carrito

// Crea nuevo carrito
carritoRouter.post('', async (req, res) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try{
            const answer = await storage.save(req.body)
            return res.status(201).json(answer)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Borra carrito especifico
carritoRouter.delete('/:id', async (req, res) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try {
            const answer = await storage.deleteById((req.params.id), null)
            return res.status(201).json(answer)
        } catch(error) {
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Trae productos de un carrito especifico
carritoRouter.get('/:id/productos', async (req, res) => { 
    if(authorizationLevel == 0 || authorizationLevel == 1){
        
        if(!req.params.id ){
            return res.status(500).json(`No existe el id ${req.params.id}`)
        }
        try{
            const mData = await storage.getAll((req.params.id))
            return res.status(200).json(mData)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Agrega producto a carrito especifico
carritoRouter.post('/:id/productos', async (req, res) => {
    if(authorizationLevel == 0){
        try {
            // NOTA: data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
            const answer = await storage.modifyById((req.params.id), req.body)
            return res.status(201).json(answer)
        } catch(error) {
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Borro producto de carrito especifico
carritoRouter.delete('/:id/productos/:id_prod', async (req, res) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try {
            const answer = await storage.deleteById((req.params.id), (req.params.id_prod))
            return res.status(201).json(answer)
        } catch(error) {
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})
//#endregion

module.exports = carritoRouter