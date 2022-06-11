const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://tianqiwang:${password}@cluster0.nzfipd5.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length == 3){
    Person.find({}).then(result => {
        result.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
    })
}

else {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(() => {
        console.log(`added ${name} ${number} to the phonebook`)
        mongoose.connection.close()
    })
}