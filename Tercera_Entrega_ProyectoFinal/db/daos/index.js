const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGO_URL;

//#region SCHEMAS
const schemaCarrito = require('../schema/carrito');
const schemaProducto = require('../schema/productos');
const schemaUsuario = require('../schema/usuarios');
//#endregion

//#region DAOS PRODUCTO
// Instancia de los Contenedores de Productos para distintos archivos
const ProductosDAOArchivo = require('./productos/ProductosDAOArchivo');
const ProductosDAOMemoria = require('./productos/ProductosDAOMemoria');
const ProductosDAOMongoDB = require('./productos/ProductosDAOMongoDB');
const ProductosDAOFirebase = require('./productos/ProductosDAOFirebase');
//#endregion


//#region DAOS CARRITOS
// Instancia de los Contenedores de Carritos para distintos archivos
const CarritosDAOArchivo = require('./carritos/CarritosDAOArchivo');
const CarritosDAOMemoria = require('./carritos/CarritosDAOMemoria');
const CarritosDAOMongoDB = require('./carritos/CarritosDAOMongoDB');
const CarritosDAOFirebase = require('./carritos/CarritosDAOFirebase');
//#endregion

//#region DAOS USUARIOS
// Instancia de los Contenedores de Usuarios para distintos archivos
const UsuariosDAOMongoDB = require('./usuarios/UsuariosDAOMongoDB');
//#endregion


//#region ==== FACTORY DAOS ====
const getStorage = () => {
  const storage = process.env.STORAGE || 'archivo'

  switch (storage) {
    case 'archivo':
      return {
        products: new ProductosDAOArchivo(),
        carts: new CarritosDAOArchivo(),
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
        products: ProductosDAOMongoDB.getInstance('producto', schemaProducto, uri),
        carts: CarritosDAOMongoDB.getInstance('carrito', schemaCarrito, uri),
        users: UsuariosDAOMongoDB.getInstance('usuarios', schemaUsuario, uri)
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
//#endregion

module.exports = getStorage