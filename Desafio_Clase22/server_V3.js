const express = require('express');
const { Server: HttpServer } = require('http');      
const { Server: IOServer } = require('socket.io');   
const {Router} = express;
const normalizr = require('normalizr');
const normalizrChatSchema = require('./public/normalizrSchema.js');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;

let usersArray = [];


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static(__dirname + '/public'));

//#region SET DATABASE
const url = "mongodb+srv://crisco85:3805WlsczLaCt2YB@cluster0.rmu6v4y.mongodb.net/desafios?retryWrites=true&w=majority"
//#endregion

//#region SCHEMAS
const schemaMensajes = require('./db/schema/mensajes');
const schemaProducto = require('./db/schema/productos');
//#endregion

//#region DAOS
const ProductosDAOMongoDB = require('./db/daos/ProductosDAOMongoDB');
const MensajesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB');
//#endregion

//#region CONTENEDORES 
const products = new ProductosDAOMongoDB('producto', schemaProducto, url);
const messages = new MensajesDAOMongoDB('mensaje', schemaMensajes, url);
//#endregion

//#region ROUTES
const router = Router();
app.use('/api/productos', router);

router.get('', async (req, res) => { 
    const mData = await products.getAll();
    const messageCont = await messages.getAll();
    const normalizedChat = normalizr.normalize(messageCont, normalizrChatSchema);
    
    const origLength = JSON.stringify(messageCont).length;
    const normLength = JSON.stringify(normalizedChat).length;

    console.log(messageCont);
    console.log('ORIGINAL: ', origLength);
    console.log('NORMALIZADO: ', normLength);

    return res.render('home', {
        status:1, 
        mData,
        messageCont,
        origLength,
        normLength
    });
});
//#endregion

//#region SET VIEWS CONFIG
app.set('views', './views/ejs');
app.set('view engine', 'ejs');
//#endregion

//#region SET HTTP SERVER
app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`);
});

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`);
});

server.on('error',(error) => {console.log(`Se ha detectado un error. ${error}`)});
//#endregion


//#region SET SOCKET SERVER
io.on('connection', socket => {
    console.log(`Nuevo cliente conectado con id ${socket.id}`);
    usersArray.push(socket.id);

    socket.on('addProduct', async (newProduct) => {
        const newProductID = await products.save(newProduct);
        const mData = newProduct;
        mData.id = newProductID;
        socket.emit('refreshList', mData);
        socket.broadcast.emit('refreshList', mData);
    });

    socket.on('addMessage', newMessage => {
        messages.save(newMessage);
        const messageCont = newMessage;
        socket.emit('refreshMessages', messageCont);
        socket.broadcast.emit('refreshMessages', messageCont);
    });

    socket.on('disconnect', reason => {
        usersArray = usersArray.filter(user => user != socket.id);
        console.log(`Se ha desconectado el cliente con id ${socket.id}`);
    });
});
//#endregion