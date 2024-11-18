const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'The title is required'],
    unique: true, // Índice único
    minlength: [5, 'The title must have at least 5 characters']
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String }
  ]
});

// Esperar a que los índices se creen antes de realizar operaciones de escritura.
schema.index({ title: 1 }, { unique: true });

// Middleware para manejar errores de índices únicos
schema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('The title must be unique'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Book', schema);
