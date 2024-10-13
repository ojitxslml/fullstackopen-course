import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from './components/Notification'
import blogService from "./services/blogs";
import loginService from "./services/login";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

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

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

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

  const addBlog = async (event) => {
    event.preventDefault();
    
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };
  
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setNewTitle("");
      setNewAuthor("");
      setNewUrl("");
      setNotificationMessage(`a new blog ${newTitle} by ${newAuthor} added`);
      setNotificationType("successful");
      setTimeout(() => {
        setNotificationMessage(null);
        setNotificationType(null);
      }, 5000);
    } catch (error) {
      setNotificationMessage(error);
      setNotificationType("error");
      setTimeout(() => {
        setNotificationMessage(null);
        setNotificationType(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <p>
        Title:{" "}
        <input
          value={newTitle}
          onChange={handleTitleChange}
          placeholder="Title"
        />
      </p>

      <p>
        Author:{" "}
        <input
          value={newAuthor}
          onChange={handleAuthorChange}
          placeholder="Author"
        />
      </p>

      <p>
        URL:{" "}
        <input value={newUrl} onChange={handleUrlChange} placeholder="Url" />
      </p>

      <button type="submit">save</button>
    </form>
  );

  const logout = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notificationMessage} type={notificationType} />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.name} logged-in <button onClick={logout}>logout</button>
          </p>
          {blogForm()}
        </div>
      )}

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
