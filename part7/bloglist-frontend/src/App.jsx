import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";

import {
  setNotification,
  clearNotification,
} from "./contexts/notificationSlice";

import { setUser, logout } from "./contexts/userSlice"; // Importar las acciones de Redux

import { Routes, Route, Link } from "react-router-dom";
import BlogList from "./components/BlogList";
import Users from "./components/Users";
import UserBlogs from "./components/UserBlogs";
import Blog from "./components/Blog";

const Menu = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <div>
      <Link to="/" style={padding}>
        blogs
      </Link>
      <Link to="/users" style={padding}>
        users
      </Link>
    </div>
  );
};

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginVisible, setLoginVisible] = useState(false);

  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  const user = useSelector((state) => state.user); // Obtener el usuario del Redux store

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user)); // Almacenar el usuario en el Redux store
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user)); // Almacenar el usuario en el Redux store
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(
        setNotification({
          message: "Wrong username or password",
          type: "error",
        })
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    window.localStorage.clear();
    dispatch(logout());
    window.location.reload();
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />

      {!user && loginForm()}
      {user && (
        <div>
          <Menu />
          {user.name} logged in <button onClick={handleLogout}>logout</button>
          <Routes>
            <Route path="/" element={<BlogList user={user} />} />
            <Route path="/users/:id" element={<UserBlogs />} />
            <Route path="/users" element={<Users />} />
            <Route path="/blogs/:id" element={<Blog />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
