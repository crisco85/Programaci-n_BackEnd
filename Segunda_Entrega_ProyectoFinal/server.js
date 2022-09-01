const express = require('express')
const { Server: HttpServer } = require('http')     

const productsRouter = require('./router/productosRouter')
const carritoRouter = require('./router/carritosRouter')

const app = express()
const httpServer = new HttpServer(app)

const PORT = process.env.PORT || 8080

const db = require('../Segunda_Entrega_ProyectoFinal/db/mongoDb');
const productoModel = require('../Segunda_Entrega_ProyectoFinal/db/schema/productos');
const carritoModel = require('../Segunda_Entrega_ProyectoFinal/db/schema/carrito');

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname + '/public'))

// app.set('views', './views/ejs')
// app.set('view engine', 'ejs')

app.use('/api/productos', productsRouter)
app.use('/api/carrito', carritoRouter)

//*** Respuesta cuando no encuentra la ruta especificada //
app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`)
})

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.error(`Se ha detectado un error: ${error.message}`)})
