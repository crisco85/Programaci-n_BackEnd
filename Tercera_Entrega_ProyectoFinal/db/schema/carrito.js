const { Schema, model } = require('mongoose');

const carritoSchema = new Schema({
  productos: { type: Object, required: true },
  timestamp: { type: Number, required: true },
  user: { type: String, required: true },
  status: { type: String, required: true }
})

module.exports = carritoSchema