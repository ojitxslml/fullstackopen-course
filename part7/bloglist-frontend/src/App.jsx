import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import { setNotification, clearNotification } from "./contexts/notificationSlice";
import { fetchBlogs, addBlog } from "./contexts/blogsSlice";
import { setUser, logout } from "./contexts/userSlice";  // Importar las acciones de Redux

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginVisible, setLoginVisible] = useState(false);

  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);  // Obtener el usuario del Redux store
  const BlogFormRef = useRef();

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));  // Almacenar el usuario en el Redux store
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));  // Almacenar el usuario en el Redux store
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification({ message: "Wrong username or password", type: "error" }));
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  const handleAddBlog = async (blogObject) => {
    try {
      dispatch(addBlog(blogObject));
      dispatch(setNotification({ message: `A new blog ${blogObject.title} by ${blogObject.author} added`, type: "successful" }));
      setTimeout(() => dispatch(clearNotification()), 1000);
    } catch (error) {
      dispatch(setNotification({ message: "Error adding blog", type: "error" }));
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
    dispatch(logout());  // Eliminar al usuario del Redux store
    window.location.reload();  // Recargar la página para actualizar la UI
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={BlogFormRef}>
            <BlogForm createBlog={handleAddBlog} />
          </Togglable>
        </div>
      )}
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  );
};

export default App;
