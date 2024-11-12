import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  likeBlog,
  deleteBlog,
  fetchBlogById,
  addComment,
} from "../contexts/blogsSlice";
import {
  setNotification,
  clearNotification,
} from "../contexts/notificationSlice";
import BlogCommentForm from "./BlogCommentForm";
import formatDate from "../utils/formatDate";

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


  const handleLike = async () => {
    try {
      // Esperar a que la acción de "like" se complete
      await dispatch(likeBlog(blog.id));

      // Vuelve a cargar el blog actualizado
      await dispatch(fetchBlogById(id));

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
      dispatch(
        setNotification({ message: "Added Comment!", type: "successful" })
      );
      setTimeout(() => dispatch(clearNotification()), 1000);
    } catch (error) {
      dispatch(
        setNotification({
          message: `Error adding new comment ${error}`,
          type: "error",
        })
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };



  return (
    <div className="blog bg-slate-900 rounded-md lg:mx-80 my-6 p-4 flex flex-col">
      <div >
        <span className="blog-title text-2xl font-bold">{blog.title}</span>
      </div>
      <div>
        <p>Author: {blog.author}</p>
        <p>URL: {blog.url}</p>
        <p>
          Likes: <span className="font-bold">{blog.likes}</span>  <button onClick={handleLike} className="bg-blue-500 text-white rounded-md hover:bg-blue-600  px-2 w-[50px] mx-2">Like</button>
        </p>
        {isCurrentUser && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-2 py-1 mt-4 w-[80px] rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>
      <h2 className="text-lg">Comments</h2>
      <BlogCommentForm createComment={createComment} />
     <p className="mt-4">Recent comments:</p>
      {blog.comments.map((comment) => {
        return <li key={comment._id} className="m-2 text-lg">{comment.content} <span className="opacity-30 text-xs">{formatDate(comment.date)}</span></li>;
      })}
    </div>
  );
};

export default Blog;
