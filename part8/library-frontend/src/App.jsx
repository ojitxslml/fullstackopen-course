import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AppRoutes from "./routes";
import {useState} from 'react'

const App = () => {

  const [errorMessage, setErrorMessage] = useState(null)


  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 2000)
  }

  const Notify = ({errorMessage}) => {
    if ( !errorMessage ) {
      return null
    }
    return (
      <div style={{color: 'red'}}>
      {errorMessage}
      </div>
    )
  }

  return (
    <Router>
      <div>
        <nav>
          <button>
            <Link to="/">Authors</Link>
          </button>
          <button>
            <Link to="/books">Books</Link>
          </button>
          <button>
            <Link to="/new-book">Add Book</Link>
          </button>
        </nav>
        <Notify errorMessage={errorMessage} />
        <AppRoutes  notify={notify} />
      </div>
    </Router>
  );
};

export default App;
