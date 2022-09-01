//#region Schema
const schemaCarrito = require('../schema/carrito')
const schemaProducto = require('../schema/productos')
const url = "mongodb+srv://crisco85:3805WlsczLaCt2YB@cluster0.rmu6v4y.mongodb.net/ecommerce?retryWrites=true&w=majority"
//#endregion

//#region DAO Producto
// Instancia de los Contenedores de Productos para distintos archivos
const ProductosDAOArchivo = require('./productos/ProductosDAOArchivo')
const ProductosDAOMemoria = require('./productos/ProductosDAOMemoria')
const ProductosDAOMongoDB = require('./productos/ProductosDAOMongoDB')
const ProductosDAOFirebase = require('./productos/ProductosDAOFirebase')
//#endregion

//#region DAO Carrito
// Instancia de los Contenedores de Carritos para distintos archivos
const CarritosDAOArchivo = require('./carritos/CarritosDAOArchivo')
const CarritosDAOMemoria = require('./carritos/CarritosDAOMemoria')
const CarritosDAOMongoDB = require('./carritos/CarritosDAOMongoDB')
const CarritosDAOFirebase = require('./carritos/CarritosDAOFirebase')
//#endregion

const getStorage = () => {
  const storage = process.env.STORAGE || 'archivo'
  
  switch (storage) {
    case 'archivo':
      return {
        products: new ProductosDAOArchivo(),
        carts: new CarritosDAOArchivo()
      }
      break

    case 'memoria':
      return {
        products: new ProductosDAOMemoria(),
        carts: new CarritosDAOMemoria()
      }
      break

    case 'mongodb':
      return {
        products: new ProductosDAOMongoDB('producto', schemaProducto, url),
        carts: new CarritosDAOMongoDB('carrito', schemaCarrito, url)
      }
      break

    case 'firebase':
      return {
        products: new ProductosDAOFirebase('producto'),
        carts: new CarritosDAOFirebase('carrito')
      }
      break
    default:
      return {
        products: new ProductosDAOArchivo(),
        carts: new CarritosDAOArchivo()
      }
      break
  }
}

module.exports = getStorage