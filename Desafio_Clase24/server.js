const express = require('express');
const { Server: HttpServer } = require('http');      
const { Server: IOServer } = require('socket.io');   
const {Router} = express;
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static(__dirname + '/public'));
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;


//#region SESSION MIDDLEWARE
const validateSession = (req, res, next) => {
    if (req.session.user && req.session.password){
        console.log(`Usuario validado. Sesion inicida por ${req.session.user}`);
        return next();
    }

    if (req.body.user && req.body.password){
        req.session.user = req.body.user;
        req.session.password = req.body.password;
        console.log(`Se ha registrado el usuario ${req.session.user}`);
        return next();
    }

    console.log(`No existe el usuario. Inicie sesion.`);
    return res.status(401).redirect('http://localhost:8080/login');
}
//#endregion

//#region SET MIDDLEWARES
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://crisco85:3805WlsczLaCt2YB@cluster0.rmu6v4y.mongodb.net/desafios?retryWrites=true&w=majority`,
        ttl: 60
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true
}));
//#endregion

//#region SET DATABASE
const url = "mongodb+srv://crisco85:3805WlsczLaCt2YB@cluster0.rmu6v4y.mongodb.net/desafios?retryWrites=true&w=majority";
//#endregion

//#region SCHEMAS
const schemaMensajes = require('./db/schema/mensajes');
const schemaProducto = require('./db/schema/productos');
//#endregion

//#region DAOS
const ProductosDAOMongoDB = require('./db/daos/ProductosDAOMongoDB');
const MensajesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB');
const { clearScreenDown } = require('readline');
//#endregion

//#region CONTENEDORES (CHILD)
const products = new ProductosDAOMongoDB('producto', schemaProducto, url);
const messages = new MensajesDAOMongoDB('mensaje', schemaMensajes, url);
//#endregion

//#region SET ROUTES
const router = Router();
const loginRouter = Router();
const logoutRouter = Router();
app.use('/api/productos', router);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

router.get('', validateSession, async (req, res) => { 
    const mData = await products.getAll();
    const messageCont = await messages.getAll();
    const user = req.session.user;

    return res.render('home', {
        status:1, 
        mData,
        messageCont,
        user
    });
});

loginRouter.get('', (req, res) => {
    return res.render('login');
});

loginRouter.post('/auth', validateSession, (req, res) => {
    return res.status(202).redirect('http://localhost:8080/api/productos');
});

logoutRouter.get('', (req, res) => {
    const user = req.session.user;
    if (req.session.user && req.session.password){
        return req.session.destroy(err => {
            if (!err) {
                return res.status(200).render('redirect', {user});
            }
            return res.send({ error: err });
          })
    }
    return res.status(404).redirect('http://localhost:8080/login');
});
//#endregion

//#region SET VIEWS CONFIG
app.set('views', './public/views/ejs');
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
        console.log(`Se ha desconectado el cliente con id ${socket.id}`);
    });
})
//#endregion