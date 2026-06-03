import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const generateId = () => Number((Math.random() * 1000000).toFixed(0))

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    add({ id: generateId(), content, votes: 0 })
    e.target.reset()
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm