
const Results = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  return (
    countries.map(country => (
      <li key={country.name.common}>
        <p>{country.name.common}</p>
      </li>
    ))
  )
}

export default Results