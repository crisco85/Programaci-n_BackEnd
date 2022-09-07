const express = require('express');
const { Server: HttpServer } = require('http');      
const { Server: IOServer } = require('socket.io');
const {optionsMariaDB} = require('./db/mariaDB');
const {optionsSQLite3} = require('./db/SQLite3');
const faker = require('faker');
faker.locale = 'es';

const {Router} = express; 

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;
const router = Router();

let productArray = [];

let messageArray = [];

let usersArray = [];

const Contenedor = require('./contenedor');
const products = new Contenedor(productArray, optionsMariaDB, 'productos')
const messages = new Contenedor(messageArray, optionsSQLite3, 'chat')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static(__dirname + '/public'));
app.use('/api/productos', router);

app.set('views', './views/ejs');
app.set('view engine', 'ejs');

router.get('', async (req, res) => { 
    const mData = await products.getAll();
    const messageCont = await messages.getAll();
  
    return res.render('home', {
        status:1, 
        mData,
        messageCont
    });
});

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`);
});

server.on('error',(error) => {console.log(`Se ha detectado un error`)});

io.on('connection', socket => {
    console.log(`Nuevo cliente conectado con id ${socket.id}`);
    usersArray.push(socket.id);

    socket.on('addProduct', async (newProduct) => {
        const newProductID = await products.save(newProduct)
        const mData = newProduct
        mData.id = newProductID
        socket.emit('refreshList', mData)
        socket.broadcast.emit('refreshList', mData)
    });

    socket.on('addMessage', newMessage => {
        messages.save(newMessage,'BDDchat.txt');
        const messageCont = newMessage;
        socket.emit('refreshMessages', messageCont);
        socket.broadcast.emit('refreshMessages', messageCont);
        //io.sockets.emit('refreshMessages', messageCont);
    });

    socket.on('disconnect', reason => {
        usersArray = usersArray.filter(user => user != socket.id);
        console.log(`Se ha desconectado el cliente con id ${socket.id}`);
    });
});


//#region testing
router.get('/test', async (req, res) => { 
    const mData = getAll(5)
    console.log(mData)
    const messageCont = await messages.getAll()

    return res.render('home', {
        status:1, 
        mData,
        messageCont
    })
})

//#region testing function
const getAll = (arrayLength) => {
    console.log('test requested');
    const arrayProductos = [];

    for (i = 0; i<arrayLength; i++){
        const newProduct = {
            title:faker.commerce.productName(),
            price:faker.commerce.price(),
            thumbnail: faker.random.image(),
            id: faker.datatype.number()
        }
        arrayProductos.push(newProduct)
    }

    return arrayProductos;
}
//#endregion

//#endregion
