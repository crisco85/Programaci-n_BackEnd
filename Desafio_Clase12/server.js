const express = require('express');
const { Server: HttpServer } = require('http');      
const { Server: IOServer } = require('socket.io');  
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
const products = new Contenedor(productArray);
const messages = new Contenedor(messageArray);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static(__dirname + '/public'));
app.use('/api/productos', router);

app.set('views', './views/ejs');
app.set('view engine', 'ejs');

router.get('', async (req, res) => { 
    const mData = await products.getAll('BDDproducts.txt');
    const messageCont = await messages.getAll('BDDchat.txt');
  
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
        await products.save(newProduct, 'BDDproducts.txt');
        const mData = newProduct;
        socket.emit('refreshList', mData);
        socket.broadcast.emit('refreshList', mData);
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
