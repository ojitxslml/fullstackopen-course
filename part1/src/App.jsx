import { useState } from "react";

const Button = ({ onSmash, text }) => (
  <button onClick={onSmash}>
    {text}
  </button>
)

const Display = ({ counter }) => <div>{counter}</div>
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      <Button
        onSmash={increaseByOne}
        text='plus'
      />
      <Button
        onSmash={setToZero}
        text='zero'
      />     
      <Button
        onSmash={decreaseByOne}
        text='minus'
      />           
    </div>
  )
}
export default App;
