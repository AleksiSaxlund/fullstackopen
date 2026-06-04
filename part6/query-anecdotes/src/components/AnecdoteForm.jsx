import { useAnecdotes } from "../hooks/useNotes"


const AnecdoteForm = () => {
  const { addAnecdote: addAnecdoteToServer } = useAnecdotes()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    addAnecdoteToServer(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm