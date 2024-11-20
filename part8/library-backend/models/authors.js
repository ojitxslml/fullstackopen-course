const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name is required'],
    unique: true, // Índice único
    minlength: [4, 'The name must have at least 4 characters'],
  },
  born: {
    type: Number,
  },
  bookCount: {
    type: Number,
    default: 0,
  },
});

// Esperar a que los índices se creen antes de realizar operaciones de escritura.
schema.index({ name: 1 }, { unique: true });

// Middleware para manejar errores de índices únicos
schema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('The name must be unique'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Author', schema);
