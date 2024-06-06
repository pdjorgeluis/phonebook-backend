const express = require( 'express' ) 
const app = express()
require('dotenv').config()

//const morgan  = require('morgan');

const Person = require('./models/person')
//app.use(express.static('build'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

const cors = require('cors'); 
//const { default: mongoose } = require('mongoose');

app.use(cors())
app.use(express.json());
app.use(requestLogger)



/*
morgan.token('host', (request, response) => {
    return request.hostname;
});
*/
/*
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
]*/

//app.use(morgan(':method :host :status :res[content-length] - :response-time ms :body')); //app.use(morgan('tiny'));

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

//Home
app.get('/', (request, response) => {
    const fURL = request.protocol + '://' + request.get('host');

    response.send(`<h1>Phone Book APIs</h1> 
    <p> <a href=${fURL}/info> /info </a> <br/>
        <a href=${fURL}/api/persons> /api/persons </a> <br/>
        /api/persons/id </p>`)
})
 
// GET info
app.get('/info', (request, response) => {
    /*const personCount = persons.length;
    const date = new Date();
    response.send(`<p>Phonebook has info for ${personCount} persons <br/>
                    ${date}</p>`)*/

    Person.find({}).then(persons => {
        const personCount = persons.length;
        const date = new Date();
        response.send(`<p>Phonebook has info for ${personCount} persons <br/>
        ${date}</p>`)
    })
})

// GET persons
app.get('/api/persons', (request, response) => {
    //response.json(persons)
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// GET a person
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) response.json(person);
    else {
        response.statusMessage = 'The Note was not found';
        response.status(404).end();
    }
})

/*
morgan.token('body', (request, response) => {
    return JSON.stringify(request.body);
});
*/
//ADD (POST) a person
//id generator
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n=>n.id))
        : 0
    return maxId + 1;
}

app.post('/api/persons', (request, response) => {
    const body = request.body;
    
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }/*else if(Person.find({}).then(persons => {
        persons.find(person=>person.name === body.name)
    })){
        return response.status(406).json({
            error: 'person already in bookphone'
        })
    }*/
    /*else if(persons.find(person=>person.name === body.name)){
        return response.status(406).json({
            error: 'person already in bookphone'
        })
    }*/

    const person = new Person({
        name: body.name,
        number: body.number,
        //id: generateId(),
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    //persons = persons.concat(person) 
    //response.json(person);
})

// DELETE a person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    
    if(person){
        persons = persons.filter(person => person.id !== id);
        response.status(204).end();
    }else{
        response.statusMessage = 'The Note was not found';
        response.status(404).end();
    }
    
})

app.use(unknownEndpoint)
app.use(errorHandler)

const port = process.env.PORT || 3001 //setting port and environment variable
app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
})