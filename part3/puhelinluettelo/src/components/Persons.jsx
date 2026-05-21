import Person from './Person'

const Persons = ({ persons, deletePerson }) => {
  return (
    persons.map(person =>
      <li key={person.name}>
        <Person person={person} deletePerson={deletePerson} />
      </li>
    )
  )
}

export default Persons