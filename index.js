const express = require( 'express' ) 
const app = express()
const morgan  = require('morgan');

app.use(express.json());

morgan.token('host', (request, response) => {
    return request.hostname;
});


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

app.use(morgan(':method :host :status :res[content-length] - :response-time ms :body')); //app.use(morgan('tiny'));
//Home
app.get('/', (request, response) => {
    const fURL = request.protocol + '://' + request.get('host');

    response.send(`<h1>Phone Book APIs</h1> 
    <p> <a href=${fURL}/info> /info </a> <br/>
        <a href=${fURL}/api/persons> /api/persons </a> <br/>
        <a href=${fURL}/api/persons/id> /api/persons/id </a> </p>`)
})
 
// GET info
app.get('/info', (request, response) => {
    const personCount = persons.length;
    const date = new Date();
    response.send(`<p>Phonebook has info for ${personCount} persons <br/>
                    ${date}</p>`)
})

// GET persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
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

//id generator
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n=>n.id))
        : 0
    return maxId + 1;
}

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body);
});
//ADD (POST) a person
app.post('/api/persons', (request, response) => {
    
    
    const body = request.body;
    
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }else if(persons.find(person=>person.name === body.name)){
        return response.status(406).json({
            error: 'person already in bookphone'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    
    persons = persons.concat(person)
    
    response.json(person);
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})