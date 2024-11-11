import React, { useRef } from "react";
import Blog from "./Blog";
import { fetchBlogs } from "../contexts/blogsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import { addBlog } from "../contexts/blogsSlice";
import {
  setNotification,
  clearNotification,
} from "../contexts/notificationSlice";
import { Link } from "react-router-dom";

const BlogList = () => {
  const BlogFormRef = useRef();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.allBlogs);
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleAddBlog = async (blogObject) => {
    try {
      dispatch(addBlog(blogObject));
      dispatch(
        setNotification({
          message: `A new blog ${blogObject.title} by ${blogObject.author} added`,
          type: "successful",
        })
      );
      setTimeout(() => dispatch(clearNotification()), 1000);
    } catch (error) {
      dispatch(
        setNotification({ message: "Error adding blog", type: "error" })
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };
  return (
    <div>
      <Togglable buttonLabel="new blog" ref={BlogFormRef}>
        <BlogForm createBlog={handleAddBlog} />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <p key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </p>
      ))}
    </div>
  );
};

export default BlogList;
