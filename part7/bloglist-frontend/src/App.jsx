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

import { setUser, logout } from "./contexts/userSlice";

import { Routes, Route, Link } from "react-router-dom";
import BlogList from "./components/BlogList";
import Users from "./components/Users";
import UserBlogs from "./components/UserBlogs";
import Blog from "./components/Blog";

const Menu = ({ user, handleLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl">
          Blog App
        </Link>
      </div>
      <div className="hidden md:flex space-x-6">
        <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">
          Blogs
        </Link>
        <Link to="/users" className="hover:bg-gray-700 px-3 py-2 rounded">
          Users
        </Link>
      </div>
      <div className="flex items-center">
        {user ? (
          <div className="flex items-center space-x-4">
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-2 rounded hover:bg-red-700"
            >
              logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setMenuVisible(true)}
            className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700"
          >
            log in
          </button>
        )}
      </div>
      <button
        className="md:hidden text-white"
        onClick={() => setMenuVisible(!menuVisible)}
      >
        <span className="material-icons">menu</span>
      </button>
      {menuVisible && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 text-white p-4 md:hidden">
          <div className="space-y-4">
            <Link to="/" className="block hover:bg-gray-700 px-3 py-2 rounded">
              Blogs
            </Link>
            <Link
              to="/users"
              className="block hover:bg-gray-700 px-3 py-2 rounded"
            >
              Users
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginVisible, setLoginVisible] = useState(false);

  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
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
        <div style={hideWhenVisible} className="flex flex-col justify-center items-center ">
          <h2 className="mt-20 text-xl capitalize">Please Log in to view or create blogs</h2>
          <button
            onClick={() => setLoginVisible(true)}
            className="bg-blue-600 mt-4 px-3 py-2 rounded hover:bg-blue-700 w-[200px]"
          >
            log in
          </button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
            handleCancel={() => setLoginVisible(false)} // Pasamos handleCancel aquí
          />
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
    <div className="min-h-screen bg-slate-700 text-white overflow-hidden">
      

      {!user && loginForm()}
      {user && (
        <div>
          <Menu user={user} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<BlogList user={user} />} />
            <Route path="/users/:id" element={<UserBlogs />} />
            <Route path="/users" element={<Users />} />
            <Route path="/blogs/:id" element={<Blog />} />
          </Routes>
        </div>
      )}
      <Notification message={notification.message} type={notification.type} />
    </div>
  );
};

export default App;
