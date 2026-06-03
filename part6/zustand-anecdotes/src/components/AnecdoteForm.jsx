import { useAnecdoteActions, useNotificationActions } from '../store'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const addAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    const newAnecdote = await anecdoteService.createNew(content)
    add(newAnecdote)
    setNotification(`Added anecdote '${content}' successfully`)
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