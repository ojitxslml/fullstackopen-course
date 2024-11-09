import { useState } from "react";
import { useDispatch } from "react-redux";
import { likeBlog, deleteBlog } from "../contexts/blogsSlice";
import {
  setNotification,
  clearNotification,
} from "../contexts/notificationSlice";

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    padding: 4,
    border: "solid",
    borderWidth: 1,
    marginBottom: 4,
  };

  const handleLike = async () => {
    try {
      dispatch(likeBlog(blog.id));
      dispatch(setNotification({ message: "Blog liked!", type: "successful" }));
      setTimeout(() => dispatch(clearNotification()), 1000);
    } catch (error) {
      dispatch(
        setNotification({ message: "Error liking blog", type: "error" })
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  const handleDelete = async () => {
    const confirmDeletion = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    );
    if (confirmDeletion) {
      try {
        dispatch(deleteBlog(blog.id));
        dispatch(
          setNotification({ message: "Blog deleted!", type: "successful" })
        );
        setTimeout(() => dispatch(clearNotification()), 1000);
      } catch (error) {
        dispatch(
          setNotification({ message: "Error deleting blog", type: "error" })
        );
        setTimeout(() => dispatch(clearNotification()), 5000);
      }
    }
  };

  const isCurrentUser = user?.username === blog?.user?.username;

  return (
    <div className="blog" style={blogStyle}>
      <div>
        <span className="blog-title">{blog.title}</span>
        <span>{blog.author}</span>
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.author}</p>
          {isCurrentUser && (
            <button
              onClick={handleDelete}
              style={{ marginLeft: "10px", color: "red" }}
            >
              delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
