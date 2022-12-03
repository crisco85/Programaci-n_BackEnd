const express = require('express')
const { Router } = express
const productsRouter = Router()

const validateSession = require('../utils/sessionValidator')

const { getProductById, addProduct, editProduct, deleteProduct } = require('../controllers/productController')

// RUTAS PRODUCTO

// Trae listado de productos o un producto especifico del listado segun su ID
productsRouter.get('/:id?', validateSession, getProductById)

// Agrega un producto al listado de productos
productsRouter.post('', validateSession, addProduct)

// Modifica un procucto del listado de productos segun su ID
productsRouter.put('/:id', validateSession, editProduct)

// Elimina un producto del listado de productos segun su ID
productsRouter.delete('/:id', validateSession, deleteProduct)

module.exports = productsRouter