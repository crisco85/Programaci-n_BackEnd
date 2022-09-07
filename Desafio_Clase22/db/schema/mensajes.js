const { Schema } = require('mongoose');

const carritoSchema = new Schema({
  author: { type: Object, required: true },
  text: { type: String, required: true }
});

module.exports = carritoSchema;