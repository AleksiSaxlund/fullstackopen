import { useFeedbackControls } from './store'

const Buttons = () => {
  const { addGood, addNeutral, addBad } = useFeedbackControls()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={addGood}>good</button>
      <button onClick={addNeutral}>neutral</button>
      <button onClick={addBad}>bad</button>
    </div>
  )
}

export default Buttons
