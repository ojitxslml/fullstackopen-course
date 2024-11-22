import { BrowserRouter as Router, Link } from "react-router-dom";
import AppRoutes from "./routes";
import { useState } from "react";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 2000);
  };

  const Notify = ({ errorMessage }) => {
    console.log("Notification Message:", errorMessage); // Verifica que el mensaje se pase correctamente
  
    if (!errorMessage) {
      return null;
    }
    return <div style={{ color: "red" }}>{errorMessage}</div>;
  };

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
          {token && (
            <>
              <button>
                <Link to="/new-book">Add Book</Link>
              </button>
              <button>
                <Link to="/recommendations">Recommend</Link>
              </button>
            </>
          )}

          {!token ? (
            <button>
              <Link to="/login">Login</Link>
            </button>
          ) : (
            <button onClick={logout}>logout</button>
          )}
        </nav>
        <Notify errorMessage={errorMessage} />
        <AppRoutes notify={notify} setToken={setToken} />
      </div>
    </Router>
  );
};

export default App;
