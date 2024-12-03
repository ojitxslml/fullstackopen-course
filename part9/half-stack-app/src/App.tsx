const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
  ];

  interface CoursePartBase {
    name: string;
    exerciseCount: number;
  }

  interface CoursePartDescription extends CoursePartBase {
    description: string;
  }

  interface CoursePartBasic extends CoursePartDescription {
    kind: "basic";
  }

  interface CoursePartSpecial extends CoursePartDescription {
    requirements: string[];
    kind: "special";
  }

  interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group";
  }

  interface CoursePartBackground extends CoursePartDescription {
    backgroundMaterial: string;
    kind: "background";
  }

  type CoursePart =
    | CoursePartBasic
    | CoursePartGroup
    | CoursePartBackground
    | CoursePartSpecial;

  interface HeaderProps {
    coursename: string;
  }

  interface TotalProps {
    courseParts: {
      name: string;
      exerciseCount: number;
    }[];
  }

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const Header = (props: HeaderProps) => {
    return <h1>{props.coursename}</h1>;
  };

  const Content = (props: { courseParts: CoursePart[] }) => {
    return (
      <div>
        {props.courseParts.map((part, index) => (
          <Part key={index} part={part} />
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

  const Part = (props: { part: CoursePart }) => {
    const { part } = props;
    switch (part.kind) {
      case "basic":
        return (
          <div>
            <h3>{part.name}</h3>
            <p>Exercises: {part.exerciseCount}</p>
            <p>Description: {part.description}</p>
          </div>
        );
      case "group":
        return (
          <div>
            <h3>{part.name}</h3>
            <p>Exercises: {part.exerciseCount}</p>
            <p>Group Projects: {part.groupProjectCount}</p>
          </div>
        );
      case "background":
        return (
          <div>
            <h3>{part.name}</h3>
            <p>Exercises: {part.exerciseCount}</p>
            <p>Description: {part.description}</p>
            <p>
              Background Material:{" "}
              <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
            </p>
          </div>
        );
      case "special":
        return (
          <div>
            <h3>{part.name}</h3>
            <p>Exercises: {part.exerciseCount}</p>
            <p>Description: {part.description}</p>
            {
              <ul>
                {part.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            }
          </div>
        );
      default:
        return assertNever(part);
    }
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
