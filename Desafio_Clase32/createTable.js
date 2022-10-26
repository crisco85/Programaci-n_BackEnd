const {optionsMariaDB} = require('./db/mariaDB')
const {optionsSQLite3} = require('./db/SQLite3')
const Maria = require('knex')(optionsMariaDB)
const SQLite3 = require('knex')(optionsSQLite3)

Maria.schema
    .createTable('productos', table => {
        table.string('title')
        table.float('price')
        table.string('thumbnail')
        table.increments('id')
    })
    .then(() => {
        console.log('Tabla PRODUCTOS Creada')
        return SQLite3.schema.createTable('chat', table => {
            table.string('mail')
            table.string('timestamp')
            table.string('message')
            table.increments('id')
        })
    })
    .then(() => {
        console.log('Tabla CHAT Creada')
    })
    .catch(error => {
        console.log(error.message)
    })
    .finally(() => {
        SQLite3.destroy()
        Maria.destroy()
    })