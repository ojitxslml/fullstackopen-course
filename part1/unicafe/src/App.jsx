import { useState } from "react";

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = all > 0 ? (good - bad) / all : 0;
  const positive = all > 0 ? (good / all) * 100 : 0;

  return (
    <div>
      <h1>statistics</h1>
      {all > 0 ? (
        <table>
          <tbody>
          <StatisticLine text="Good" value={good}></StatisticLine>
          <StatisticLine text="Neutral" value={neutral}></StatisticLine>
          <StatisticLine text="Bad" value={bad}></StatisticLine>
          <StatisticLine text="All" value={all}></StatisticLine>
          <StatisticLine text="Average" value={average}></StatisticLine>
          <StatisticLine text="Positive" value={positive+"%"}></StatisticLine>
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
};

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}: </td><td>{props.value}</td>
    </tr>
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
