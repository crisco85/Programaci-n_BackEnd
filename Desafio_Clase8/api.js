//importamos los modulos a utilizar
const Contenedor = require('./contenedor');
const express = require('express');
const {Router} = express;

const router = Router();
const app = express(); 
const port = 8080;

const mServer = app.listen(port, () => {
    console.log(`Servidor Http escuchando en el puerto ${mServer.address().port}`);
})

mServer.on("error", error => console.log(`Error en servidor ${error}`))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/productos', apiRouter)

const mProductArray = [
    {title: 'Procesador', price: 55000, thumbnail:'https://www.amd.com/es/products/cpu/amd-ryzen-7-1800x', id: 1},
    {title: 'Monitor', price: 23500, thumbnail:'https://www.pngfind.com/mpng/mobhJ_monitor-definicion-de-monitor-de-computadora-hd-png/', id: 2}
]

const mContenedor = new Contenedor(mProductArray);



router.get('', (req, res) => {
    const mData =  mContenedor.getAll();   
    return res.json({mData})
})

router.get('/:id', (req, res) => {
    const mSelectedProduct = mContenedor.getById(req.params.id)
    return res.json({mSelectedProduct})
})

router.post('', (req, res) => {
    mContenedor.save(req.body)
    return res.send({newProduct: req.body})
})

router.put('/:id', (req, res) => {
    const mId = Number(req.params.id)
    const mData = req.body 
    const mConsulta = products.modifyById(mId, mData)
    
    return res.json({mConsulta})
})

router.delete('/:id', (req, res) => {
    const mId = req.params.id
    const mData = products.deleteById(mId)
    return res.json({mData})
})