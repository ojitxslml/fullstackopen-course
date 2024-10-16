import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from './components/Notification'
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const BlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);



  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotificationMessage("Wrong username or password");
      setNotificationType("error");
      setTimeout(() => {
        setNotificationMessage(null);
        setNotificationType(null);
      }, 5000);
    }
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setNotificationMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`);
      setNotificationType("successful");
      setTimeout(() => {
        setNotificationMessage(null);
        setNotificationType(null);
      }, 5000);
    } catch (error) {
      setNotificationMessage("Error adding blog");
      setNotificationType("error");
      setTimeout(() => {
        setNotificationMessage(null);
        setNotificationType(null);
      }, 5000);
    }
  };

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

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
    )
  }

  const logout = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notificationMessage} type={notificationType} />

{!user && loginForm()}
{user && <div>
       <p>{user.name} logged in <button onClick={logout}>logout</button></p>
       <Togglable buttonLabel='new note' ref={BlogFormRef}>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
      </div>
     } 
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
