
const Total = ({ parts }) => {
  const exercises = parts.map(part => part.exercises)
  const numberOfExercises = exercises.reduce((total, current) => {
    return total + current
  }, 0)

  return(
    <div>
      <p><b>Number of exercises {numberOfExercises}</b></p>
    </div>
  )
}

export default Total