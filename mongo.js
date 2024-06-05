const mongoose = require('mongoose')

console.log(process.argv.length);
if (process.argv.length<1) {
  console.log('give password, name and number as argument')
  process.exit(1)
}else if (process.argv.length<4 ){
    const password = process.argv[2]
    const url =
    `mongodb+srv://lajito:${password}@cluster0.9amvxup.mongodb.net/phonebookApp?
    retryWrites=true&w=majority&appName=Cluster0`
    mongoose.set('strictQuery',false)

    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    })

    const Person = mongoose.model('Person', personSchema)
    
    console.log('phonebook:');
    Person.find().then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close() // connection close must be at the end of the callback function
    })
    
}else{
    const password = process.argv[2]
    const name = process.argv[3]
    const number = process.argv[4]

    const url =
    `mongodb+srv://lajito:${password}@cluster0.9amvxup.mongodb.net/phonebookApp?
    retryWrites=true&w=majority&appName=Cluster0`
    mongoose.set('strictQuery',false)

    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    const person  = new Person({
        name: name,
        number: number,
    })
    person.save().then(result => {
        console.log(`added ${name} ${number} to your phonebook`)
        mongoose.connection.close()
      })
}














/*Note.find({important:true}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})*/