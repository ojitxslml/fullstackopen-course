import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const Button = (props) => {
    return(
    <button onClick={props.handleClick}>{props.text}</button>
  )}

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={()=>setGood(good+1)} text={"good"}></Button>
      <Button handleClick={()=>setNeutral(neutral+1)} text={"neutral"}></Button>
      <Button handleClick={()=>setBad(bad+1)} text={"bad"}></Button>
      <h1>statics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App