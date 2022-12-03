const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  username: { type: Object, required: true },
  password: { type: String, required: true },
  edad: { type: Number, required: true },
  direccion: { type: String, required: true },
  telefono: { type: Number, required: true },
  foto: { type: String, required: true },
  timestamp: { type: String, required: true }
})

module.exports = usuarioSchema