const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://aleksisaxlund:${password}@cluster0.swccc6g.mongodb.net/puhelinluetteloApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })


const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  console.log('phonebook:')

  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
}

const name = process.argv[3]
const number = process.argv[4]

const person = new Person ({
  name: name,
  number: number,
})

person.save().then(() => {
  console.log('person saved!')
  mongoose.connection.close()
})