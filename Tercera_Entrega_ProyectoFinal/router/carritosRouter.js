const express = require('express');
const { Router } = express;

const dotenv = require('dotenv');
dotenv.config();

const carritoRouter = Router();

const validateSession = require('../utils/sessionValidator');

const { getUsersCart, createCart, deleteCart, getProductsFromCart, addProductToCart, deleteProductFromCart, finishPurchase } = require('../controllers/cartController')

// RUTAS CARRITO

// Busca los carritos asociados al usuario
carritoRouter.get('', validateSession, getUsersCart)

// Crea nuevo carrito
carritoRouter.post('', validateSession, createCart)

// Borra carrito especifico
carritoRouter.delete('/:id', validateSession, deleteCart)

// Trae productos de un carrito especifico
carritoRouter.get('/:id/productos', validateSession, getProductsFromCart)

// Agrega producto a carrito especifico
carritoRouter.post('/:id/productos', validateSession, addProductToCart)

// Borro producto de carrito especifico
carritoRouter.delete('/:id/productos/:id_prod', validateSession, deleteProductFromCart)

// Terminar la compra
carritoRouter.post('/buy', validateSession, finishPurchase)

module.exports = carritoRouter