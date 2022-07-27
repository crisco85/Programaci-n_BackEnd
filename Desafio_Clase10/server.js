//importamos los modulos a utilizar
const Contenedor = require('./contenedor');
const express = require('express');
const {Router} = express;
const handlebars = require('express-handlebars');

const router = Router();
const app = express(); 
const port = 8080;

const mServer = app.listen(port, () => {
    console.log(`Servidor Http escuchando en el puerto ${mServer.address().port}`);
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/productos', router)

const mProductArray = [
    {title: 'Procesador', price: 55000, thumbnail:'https://cdn2.iconfinder.com/data/icons/80-s-stuffs-outline/59/Asset_3-128.png', id: 1},
    {title: 'Monitor', price: 23500, thumbnail:'https://cdn2.iconfinder.com/data/icons/80-s-stuffs-outline/62/Asset_14-512.png', id: 2}
]

const mContenedor = new Contenedor(mProductArray);

//#region handlebars
// app.engine('hbs', handlebars.engine({
//     extname: '.hbs',
//     defaultLayout: 'main.hbs',
//     layoutsDir: __dirname + '/views/hbs',
//     partialsDir: __dirname + '/views/partials'
// }));

// app.set('views', './views/hbs');
// app.set('view engine', 'hbs');
//#endregion

//#region Pug
// app.set('views', './views/pug');
// app.set('view engine', 'pug');
// //#endregion

//#region ejs
app.set('views', './views/ejs');
app.set('view engine', 'ejs');
//#endregion

router.get('', (req, res) => {
    const mData =  mContenedor.getAll();   
    // return res.json({mData})
    return res.render('home', {status: 1})
})

router.get('/all', (req, res) => {
    const mData = mContenedor.data
    let length = null
    if(mData.length > 0){
        length = mData.length
    }
    return res.render('productList', {mData, length})
})

// router.get('/:id', (req, res) => {
//     const mSelectedProduct = mContenedor.getById(req.params.id)
//     return res.json({mSelectedProduct})
// })

router.post('', (req, res) => {
    if(req.body.title && req.body.price && req.body.thumbnail != ''){
        mContenedor.save(req.body)
        return res.render('home',{status: 1, hbsStatus: null})
    }
    else{
        return res.render('home',{status: 0, hbsStatus: 'missing data'})
    }
})

// router.put('/:id', (req, res) => {
//     const mId = Number(req.params.id)
//     const mData = req.body 
//     const mConsulta = products.modifyById(mId, mData)
    
//     return res.json({mConsulta})
// })

// router.delete('/:id', (req, res) => {
//     const mId = req.params.id
//     const mData = products.deleteById(mId)
//     return res.json({mData})
// })


mServer.on("error", error => console.log(`Error en servidor ${error}`))