const Header = ({ course }) => <h1>{course}</h1>


const Total = ({parts}) => {
  const total = parts.reduce((prev,cur) => prev+cur.exercises, 0)
  return(
    <strong>total of {total} exercises</strong>
  )
}


const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part}/>)}
    </div>
  )
}


const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course