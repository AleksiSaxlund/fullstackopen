import Part from "./Part"

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part =>
        <li key={part.id}>
          <Part name={part.name} exercises={part.exercises}/>
        </li>
      )}
    </div>
  )
}

export default Content