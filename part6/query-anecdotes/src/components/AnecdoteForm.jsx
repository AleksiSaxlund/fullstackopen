import { useAnecdotes } from "../hooks/useNotes"
import NotificationContext from "../NotificationContext"
import useNotification from "../hooks/useNotify"

const AnecdoteForm = () => {
  const { addAnecdote: addAnecdoteToServer } = useAnecdotes()
  const { setNotification } = useNotification()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    addAnecdoteToServer(content)
    setNotification(`Added anecdote ${content}`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
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