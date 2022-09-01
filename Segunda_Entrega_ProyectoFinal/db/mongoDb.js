const mongoose = require('mongoose')
const url = "mongodb+srv://crisco85:3805WlsczLaCt2YB@cluster0.rmu6v4y.mongodb.net/ecommerce?retryWrites=true&w=majority"

const connection = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(_ => console.log("Conexion a DB Atlas exitosa"))

module.exports = connection