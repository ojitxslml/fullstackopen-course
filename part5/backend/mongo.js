const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://0x5:${password}@fullstack.2qc03.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length < 5) {
  // Mostrar todas las notas si no se proporciona suficiente información
  Note.find({}).then((result) => {
    console.log('notes:')
    result.forEach((note) => {
      console.log(`${note.content} (important: ${note.important})`)
    })
    mongoose.connection.close()
  })
} else {
  // Guardar una nueva nota si se proporcionan argumentos
  const note = new Note({
    content: process.argv[3],
    important: process.argv[4] === 'true',  // Espera un argumento 'true' o 'false' para marcar la nota como importante
  })

  note.save().then(() => {
    console.log(`added note: "${process.argv[3]}" (important: ${process.argv[4]})`)
    mongoose.connection.close()
  })
}
