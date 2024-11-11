import React, { useState } from "react";

const BlogCommentForm = ({ createComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createComment({
      comment: newComment,
    });

    setNewComment("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <input
          value={newComment}
          onChange={handleChange}
          placeholder="Comment"
        />
      </p>
      <button type="submit">Add comment</button>
    </form>
  );
};

export default BlogCommentForm;
