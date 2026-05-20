import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import Content from './components/Content'
import countryService from './services/country'

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countryService
      .getAll()
        .then(countries => {
        setCountries(countries)
        console.log(countries)
        console.log(countries.length)
      })
  }, [])

  const handleSearch = event => {
    setSearch(event.target.value)
  }

  const countriesToShow = countries.filter(country => 
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return(
    <div>
      <SearchBar search={search} handleSearch={handleSearch} />
      <Content countries={countriesToShow} />
    </div>
  )
}

export default App