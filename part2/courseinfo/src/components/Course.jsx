const Header = ({ course }) => {
    return <h1>{course.name}</h1>;
  };
  
  const Part = ({ part, exercises }) => {
    return (
      <p>
        {part} {exercises}
      </p>
    );
  };
  
  const Content = ({ parts }) => {
    return (
      <>
        {parts.map((part) => (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        ))}
      </>
    );
  };
  
  const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
    return <p>Number of exercises {totalExercises}</p>;
  };
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    );
  };
  
  export default Course;
  