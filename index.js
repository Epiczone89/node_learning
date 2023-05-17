const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

const requestLogger = (request, response, next) => 
{
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => 
{
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  app.get('/', (req, res) => 
  {
    res.send('<h1>Hello World!</h1>')
  })

  app.get('/api/notes', (req, res) => 
  {
    res.json(notes)
  })
  
  const generateId = () => 
  {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    return maxId + 1
  }

  app.post('/api/notes', (request, response) => 
  {  
    Note.find({}).then(notes => 
      {
        response.json(notes)
      })
  })

  app.get('/api/notes/:id', (request, response) => 
  {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (note) 
    {
      response.json(note)
    } else 
    {
      response.status(404).end()
    }
  })

  app.delete('/api/notes/:id', (request, response) => 
  {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  app.use(unknownEndpoint)

  const mongoose = require('mongoose')

  // ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
  const url =
  `mongodb+srv://Admin:Qwerty@training.wpdz4xf.mongodb.net/noteApp?retryWrites=true&w=majority`
  
  mongoose.set('strictQuery',false)
  mongoose.connect(url)
  
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })
  
  const Note = mongoose.model('Note', noteSchema)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => 
  {
    console.log(`Server running on port ${PORT}`)
  })