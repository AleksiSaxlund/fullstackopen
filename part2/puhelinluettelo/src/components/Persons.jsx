import Person from './Person'

const Persons = ({ persons }) => {
  return (
    persons.map(person =>
      <li key={person.name}>
        <Person person={person} />
      </li>
    )
  )
}

export default Persons