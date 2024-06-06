const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url);
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error conecting to MongoDB:', error.message);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLenght: 4,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: (v) => /\d{3}-\d{3}\d{4}/.test(v) || /\d{2}-\d{3}\d{4}/.test(v),
            message: props => `${props.value} is not a valid phone number!`
        },
        minLenght: 8,
        required: [true, 'User phone number required']
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)