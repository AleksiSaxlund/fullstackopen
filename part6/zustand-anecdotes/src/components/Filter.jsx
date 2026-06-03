import { useAnecdoteActions } from '../store'

const Filter = () => {
  const { setFilter } = useAnecdoteActions()

  const handleChange = (event) => {
    event.preventDefault()
    //console.log(event.target.value)
    const search = event.target.value
    setFilter(search)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter