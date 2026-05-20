import Country from './Country'
import Results from './Results'

const Content = ({ countries}) => {

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }
  return(
    <div>
      <Results countries={countries} />
    </div>
  )
}

export default Content