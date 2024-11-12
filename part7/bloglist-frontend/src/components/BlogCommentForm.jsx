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
  const inputClass = "border border-gray-300 rounded px-3 py-1 w-[300px] text-gray-600";
  return (
    <form onSubmit={handleSubmit}>
      <p>
        <input
          value={newComment}
          onChange={handleChange}
          placeholder="Comment"
          className={inputClass}
        />
      </p>
      <button type="submit"  className="bg-blue-500 text-white px-6 py-2 mt-4 rounded hover:bg-blue-600">Add comment</button>
    </form>
  );
};

export default BlogCommentForm;
