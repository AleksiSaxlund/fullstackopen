import { useEffect, useState } from 'react'
import personService from './services/person'
import Persons from './components/Persons'
import Filter from './components/Filter'
import AddPerson from './components/AddPerson'
import Notification from './components/Notification'
import Error from './components/Error'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const exists = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())
    if (exists) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
      const id = existingPerson.id
      const changedPerson = {...existingPerson, number: newNumber}

      personService
        .updateNumber(id, changedPerson)
          .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Updated the phone number of ${existingPerson.name}`)
          })
          .catch(error => {
            if (error.response && error.response.status === 400) {
              showError(error.response.data.error)
            } else {
              showError(`Information of ${existingPerson.name} has already been removed from the server`)
              setPersons(persons.filter(person => person.id !== id))
            }
          })
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
        .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${personObject.name}`)
        })
        .catch(error => {
          showError(error.response.data.error)
          return
        })
  }

  const deletePerson = (id, name) => {
    window.confirm(`Delete ${name} ?`)

    personService
      .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    showNotification(`Deleted ${name}`)
  }

  const showNotification = message => {
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const showError = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Error message={errorMessage} />
      <Filter filter={filter} handleFilter={handleFilter}/>
      <h2>Add a new</h2>
      <AddPerson
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )

}

export default App