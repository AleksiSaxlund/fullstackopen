import { useState } from 'react'

const Button = ({ onClick, text}) => {
  return(
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Header = ({ text }) => {
  return(
    <h1>{text}</h1>
  )
}
const Anecdote = ({ anecdote, votes }) => {
  return(
    <div>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0, 0])

  const largest = Math.max(...votes)
  const popular = votes.indexOf(largest)

  const changeAnecdote = (anecdotes) => {
    const length = anecdotes.length
    const choice = Math.floor(Math.random() * length)
    setSelected(choice)
  }
  const addVote = (selected) => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <Header text='Anecdote of the day'/>
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]}/>
      <Button onClick={() => addVote(selected)} text='vote'/>
      <Button onClick={() => changeAnecdote(anecdotes)} text='next anecdote'/>
      
      <Header text='Anecdote with most votes'/>
      <Anecdote anecdote={anecdotes[popular]} votes={votes[popular]}/>
    </div>
  )
}

export default App