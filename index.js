// index file for the phonebook backend

// import express, morgan, and cors
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// create app using express
const app = express();

// create body token for morgan logs
morgan.token('body', (req) => JSON.stringify(req.body));

// use middleware to parse response json, log with morgan, and change origin policy with cors
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());

// persons pre-loaded into phone book
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// get request for all persons
app.get('/api/persons', (request, response) => {
  console.log('get request for all persons');
  response.json(persons);
});

// get info page 
app.get('/info', (request, response) => {
  console.log('info get request');
  let len = persons.length;
  let now = new Date();
  let text = `<p>Phonebook has info for ${len} people</p><p>${now}</p>`
  response.send(text);
});

// get individual person from persons
app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id);
  let person = persons.find(p => p.id === id);
  if(!person) {
    return response.status(404).end();
  }
  response.json(person);
})

// delete a person
app.delete('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
});

// function to generate an new ID
const generateID = () => Math.floor(Math.random() * 999999);

// add new person with random ID
app.post('/api/persons', (request, response) => {
  let body = request.body;
  let dupe = persons.find(p => p.name === body.name)
  if(!body.name || !body.number) {
    return response.status(400).json({
      error: "missing name or number"
    });
  }
  else if(dupe) {
    return response.status(400).json({
      error: "name must be unique"
    });
  }
  let person = {
    id: generateID(),
    name: body.name,
    number: body.number
  };
  persons = persons.concat(person);
  response.json(person);
});

// listen on port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});