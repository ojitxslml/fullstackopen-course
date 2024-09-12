import { useState } from "react";

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = all > 0 ? (good - bad) / all : 0;
  const positive = all > 0 ? (good / all) * 100 : 0;

  return (
    <div>
      <h1>statistics</h1>
      {all > 0 ? (
        <>
          <p>Good: {good}</p>
          <p>Neutral: {neutral}</p>
          <p>Bad: {bad}</p>
          <p>All: {all}</p>
          <p>Average: {average}</p>
          <p>Positive: {positive}%</p>
        </>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
};

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text={"good"}></Button>
      <Button
        handleClick={() => setNeutral(neutral + 1)}
        text={"neutral"}
      ></Button>
      <Button handleClick={() => setBad(bad + 1)} text={"bad"}></Button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
