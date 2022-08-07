const express = require('express');
const { Server: HttpServer } = require('http');     

const app = express();
const PORT = process.env.PORT || 8080;

const {Router} = express;
const productsRouter = Router();
const cartRouter = Router();

let productArray = [];
let cartArray = [];

const administrador = true;

const Contenedor = require('./contenedor');
const products = new Contenedor(productArray);
const carts = new Contenedor(cartArray);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/static', express.static(__dirname + '/public'));

// app.set('views', './views/ejs')
// app.set('view engine', 'ejs')

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);

//#region Producto
//Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
productsRouter.get('/:id?', async (req, res) => { 
    if(administrador){
        if(req.params.id){
            const mData = await products.getById(Number(req.params.id),'BDDproducts.txt');
            return res.status(200).json(mData);
        }

        try{
            const mData = await products.getAll('BDDproducts.txt', null);
            return res.status(200).json(mData);
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } 
    else 
    {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:{url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`}});
    }
});

// Para incorporar productos al listado (disponible para administradores)
productsRouter.post('', async (req, res) => {
    if(administrador){
        const answer = await products.save(req.body, 'BDDproducts.txt', null);
        return res.status(201).json(answer);
    } 
    else 
    {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`});
    }
})

// Actualiza un producto por su id (disponible para administradores)
productsRouter.put('/:id', async (req, res) => {
    if(administrador){
        //data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
        const answer = await products.modifyById('BDDproducts.txt', Number(req.params.id), req.body);
        return res.status(201).json(answer);
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`});
    }
})

// Borra un producto por su id (disponible para administradores)
productsRouter.delete('/:id', async (req, res) => {
    if(administrador){
        const answer = await products.deleteById('BDDproducts.txt', Number(req.params.id), null);
        return res.status(201).json(answer);
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`});
    }
})

//#endregion


//#region Carrito
// Crea un carrito y devuelve su id
cartRouter.post('', async (req, res) => {
    if(administrador){
        const answer = await carts.save(req.body, 'BDDcart.txt', null);
        return res.status(201).json(answer);
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`});
    }
})

// Vacía un carrito y lo elimina
cartRouter.delete('/:id', async (req, res) => {
    if(administrador){
        try {
            const answer = await carts.deleteById('BDDcart.txt', Number(req.params.id), null);
            return res.status(201).json(answer);
        } catch(error) {
            return res.status(500).json(error.message);
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`});
    }
})

// Me permite listar todos los productos guardados en el carrito
cartRouter.get('/:id/productos', async (req, res) => { 
    if(administrador){
        if(!req.params.id){
            return res.status(500).json(`No existe el id ${req.params.id}`);
        }
        try{
            const data3 = await carts.getAll('BDDcart.txt', Number(req.params.id));
            return res.status(200).json(data3);
        } catch (error) {
            return res.status(500).json(error.message);
        }
 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`});
    }
})

// Para incorporar productos al carrito por su id de producto
cartRouter.post('/:id/productos', async (req, res) => {
    if(administrador){
        // data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
        const answer = await products.modifyById('BDDcart.txt', Number(req.params.id), req.body);
        return res.status(201).json(answer);
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`});
    }
})

// Eliminar un producto del carrito por su id de carrito y de producto
cartRouter.delete('/:id/productos/:id_prod', async (req, res) => {
    if(administrador){
        try {
            const answer = await carts.deleteById('BDDcart.txt', Number(req.params.id), Number(req.params.id_prod));
            return res.status(201).json(answer);
        } catch(error) {
            return res.status(500).json(error.message);
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`});
    }
})
//#endregion


app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`)
})

const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.error(`Se ha detectado un error: ${error.message}`)})