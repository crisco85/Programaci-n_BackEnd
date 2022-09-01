const express = require('express')
const {Router} = express
const getStorage = require('../db/daos')
const productsRouter = Router()

const authorizationLevel = 0

const { products: storage } = getStorage()

//#region Producto

// Trae listado de productos o un producto especifico del listado segun su ID
productsRouter.get('/:id?', async (req, res) => { 
    if(authorizationLevel == 0 || authorizationLevel == 1){
        if(req.params.id){
            try{
                const mData = await storage.getById((req.params.id))
                return res.status(200).json(mData)
            } catch (error) {
                return res.status(500).json(error.message)
            }
        }
        try{
            const mData = await storage.getAll(null)
            return res.status(200).json(mData)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:{url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`}})
    }
})

// Agrega un producto al listado de productos
productsRouter.post('', async (req, res) => {
    if(authorizationLevel == 0){
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

// Modifica un procucto del listado de productos segun su ID
productsRouter.put('/:id', async (req, res) => {
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

// Elimina un producto del listado de productos segun su ID
productsRouter.delete('/:id', async (req, res) => {
    if(authorizationLevel == 0){
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
//#endregion

module.exports = productsRouter