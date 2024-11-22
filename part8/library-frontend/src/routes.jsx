import { Routes, Route } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";


const AppRoutes = ({ notify, setToken }) => (
  <Routes>
    <Route path="/" element={<Authors setError={notify}/>} />
    <Route path="/books" element={<Books notify={notify}/>} />
    <Route path="/new-book" element={<NewBook notify={notify} setError={notify}/>} />
    <Route path="/login" element={<LoginForm setError={notify} setToken={setToken}/>} />
    <Route path="/recommendations" element={<Recommendations setError={notify}/>} />
  </Routes>
);

export default AppRoutes;
