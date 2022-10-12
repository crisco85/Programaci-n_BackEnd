const normalizr = require('normalizr');

const authorSchema = new normalizr.schema.Entity('authors');

const messageSchema = new normalizr.schema.Entity('message');

const chatSchema = new normalizr.schema.Entity('chat', {
    author: authorSchema,
    message: [messageSchema]
}, {idAttribute: '_id'});

const chatArray = new normalizr.schema.Array(chatSchema);

exports.module = chatArray;

