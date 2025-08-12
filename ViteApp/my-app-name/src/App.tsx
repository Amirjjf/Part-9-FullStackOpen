// Header component
type HeaderProps = { courseName: string };
const Header = ({ courseName }: HeaderProps) => <h1>{courseName}</h1>;

// Base interfaces
interface CoursePartBase {
  name: string;
  exerciseCount: number;
  kind: string;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

// Part component with exhaustive switch
const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          <em>{part.description}</em>
        </p>
      );
    case "group":
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          <em>{part.description}</em>
          <br />
          submit to {part.backgroundMaterial}
        </p>
      );
    case "special":
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          <em>{part.description}</em>
          <br />
          required skills: {part.requirements.join(", ")}
        </p>
      );
    default: {
      const _exhaustiveCheck: never = part;
      return _exhaustiveCheck;
    }
  }
};

// Content component using Part
type ContentProps = { courseParts: CoursePart[] };
const Content = ({ courseParts }: ContentProps) => (
  <div>
    {courseParts.map((p) => (
      <Part key={p.name} part={p} />
    ))}
  </div>
);

// Total component
type TotalProps = { courseParts: CoursePart[] };
const Total = ({ courseParts }: TotalProps) => {
  const total = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  return <p>Number of exercises {total}</p>;
};

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
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
