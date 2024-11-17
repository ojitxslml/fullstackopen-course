import { Routes, Route } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";


const AppRoutes = ({ notify }) => (
  <Routes>
    <Route path="/" element={<Authors setError={notify}/>} />
    <Route path="/books" element={<Books />} />
    <Route path="/new-book" element={<NewBook setError={notify}/>} />
  </Routes>
);

export default AppRoutes;
