const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  interface HeaderProps {
    coursename: string;
  }

  interface ContentProps {
    courseParts: {
      name: string;
      exerciseCount: number;
    }[];
  }

  interface TotalProps {
    courseParts: {
      name: string;
      exerciseCount: number;
    }[];
  }

  const Header = (props: HeaderProps) => {
    return <h1>{props.coursename}</h1>;
  };

  const Content = (props: ContentProps) => {
    return (
      <div>
        {props.courseParts.map((part, index) => (
          <p key={index}>
            {part.name} {part.exerciseCount}
          </p>
        ))}
      </div>
    );
  };

  const Total = (props: TotalProps) => {
    const totalExercises = props.courseParts.reduce(
      (sum, part) => sum + part.exerciseCount,
      0
    );

    return <p>Total exercises: {totalExercises}</p>;
  };

  return (
    <div>
      <Header coursename={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
