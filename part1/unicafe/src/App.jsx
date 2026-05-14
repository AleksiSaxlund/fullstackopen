import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ onClick, text}) => {
  return(
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({ text, value, percentage }) => {
  if (percentage === 1) {
    return(
      <tr>
        <td>{text}</td>
        <td>{value}%</td>
      </tr>
    )
  }
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = ((good - bad) / all).toFixed(1)
  const positive = ((good / all) * 100).toFixed(1)

  if (good + neutral + bad === 0) {
    return(
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return(
    <table>
      <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="all" value={all}/>
        <StatisticLine text="average" value={average}/>
        <StatisticLine text="positive" value={positive} percentage={1}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <Header text='give feedback'/>
      <Button
        onClick={increaseGood}
        text='good'
      />
      <Button
        onClick={increaseNeutral}
        text='neutral'
      />
      <Button
        onClick={increaseBad}
        text='bad'
      />
      <Header text='statistics'/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App