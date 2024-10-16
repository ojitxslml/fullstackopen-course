import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, updateBlogList }) => {
  const [visible, setVisible] = useState(false);

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
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      updateBlogList(returnedBlog);
    } catch (error) {
      console.error("Error updating likes", error);
    }
  };

  const handleDelete = async () => {
    const confirmDeletion = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    );
    if (confirmDeletion) {
      try {
        await blogService.remove(blog.id);
        updateBlogList(blog.id);
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.author}</p>
          {user && user.username === blog.user.username && (
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
