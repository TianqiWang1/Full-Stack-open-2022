/* eslint-disable linebreak-style */
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const PORT = process.env.PORT


morgan.token('data', function (req, res) {
  return req.method == 'POST'? JSON.stringify(req.body): ''
})


app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())



app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findbyId(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.get('/api/info', (req, res, next) => {
  Person.find({})
    .then(persons => {
      const num_persons = persons.lengh
      const time = new Date()
      res.send(`<p>Phone book has info for ${num_persons} people</p> <p>${time}</p>`)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({
    name: name,
    number: number
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators:true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})