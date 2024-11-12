import { useState } from "react";

const BlogForm = ({ createBlog, user }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      user: user,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  const inputClass = "border border-gray-300 rounded px-3 py-2 text-gray-600";
  const labelClass = "m-1 text-lg font-medium";

  return (
    <form onSubmit={handleSubmit} className="">
      <p className={labelClass}>Title: </p>
      <input
        value={newTitle}
        onChange={handleTitleChange}
        placeholder="Title"
        className={inputClass}
      />
      <p className={labelClass}>Author: </p>
      <input
        value={newAuthor}
        onChange={handleAuthorChange}
        placeholder="Author"
        className={inputClass}
      />
      <p className={labelClass}>URL: </p>
      <input
        value={newUrl}
        onChange={handleUrlChange}
        placeholder="Url"
        className={inputClass}
      />
      <br />
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 mt-4  w-[80px] rounded hover:bg-blue-600"
      >
        save
      </button>
    </form>
  );
};

export default BlogForm;
