import { useAnecdotes, useAnecdoteActions, useNotificationActions } from "../store"

const AnecdoteList = () => {
  const { vote, remove } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()
  const anecdotes = useAnecdotes()

  const handleVote = (id, content) => {
    vote(id)
    setNotification(`You voted '${content}'`)
  }

  const handleRemove = (id, content) => {
    remove(id)
    setNotification(`Removed anecdote '${content}'`)
  }

  return(
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id} data-testid="anecdote-item">
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id, anecdote.content)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleRemove(anecdote.id, anecdote.content)}>remove</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList