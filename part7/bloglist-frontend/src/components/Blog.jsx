import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { likeBlog, deleteBlog, fetchBlogById, addComment   } from "../contexts/blogsSlice";
import {
  setNotification,
  clearNotification,
} from "../contexts/notificationSlice";
import BlogCommentForm from "./BlogCommentForm";

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const blog = useSelector((state) => state.blogs.blogById);
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = () => {
      setLoading(true);
      dispatch(fetchBlogById(id));
      setLoading(false);
    };

    if (id) {
      loadBlog();
    }
  }, [id, dispatch]);

  const blogStyle = {
    padding: 4,
    border: "solid",
    borderWidth: 1,
    marginBottom: 4,
  };

  const handleLike = async () => {
    try {
      // Esperar a que la acción de "like" se complete
      await dispatch(likeBlog(blog.id));
  
      // Vuelve a cargar el blog actualizado
      await dispatch(fetchBlogById(id));
  
      dispatch(setNotification({ message: "Blog liked!", type: "successful" }));
      setTimeout(() => dispatch(clearNotification()), 1000);
    } catch (error) {
      dispatch(setNotification({ message: "Error liking blog", type: "error" }));
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
        navigate("/");
      } catch (error) {
        dispatch(
          setNotification({ message: "Error deleting blog", type: "error" })
        );
        setTimeout(() => dispatch(clearNotification()), 5000);
      }
    }
  };

  const isCurrentUser = user?.username === blog?.user?.username;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const createComment = ({ comment }) => {
    try {
      dispatch(addComment({ blogId: blog.id, content: comment }));
      dispatch(setNotification({ message: "Added Comment!", type: "successful" }));
      setTimeout(() => dispatch(clearNotification()), 1000);
    } catch (error) {
      dispatch(setNotification({ message: `Error adding new comment ${error}`, type: "error" }));
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };
  return (
    <div className="blog" style={blogStyle}>
      <div>
        <span className="blog-title">{blog.title}</span>
        <span>{blog.author}</span>
      </div>
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
      <h2>Comments</h2>
      <BlogCommentForm createComment={createComment}/>
      {blog.comments.map((comment, index) => {
        return <li key={index}>{comment.content}</li>;
      })}
    </div>
  );
};

export default Blog;
