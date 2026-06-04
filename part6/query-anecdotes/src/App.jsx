import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useNotes'
import NotificationContext from "./NotificationContext"
import useNotification from './hooks/useNotify'

const App = () => {
  const { anecdotes, isError, isPending, addVote: addVoteToServer } = useAnecdotes()
  const { setNotification } = useNotification()

  const handleVote = (anecdote) => {
    addVoteToServer(anecdote)
    setNotification(`anecdote ${anecdote.content} voted`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App