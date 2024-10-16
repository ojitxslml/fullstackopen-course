import { useState } from "react";

const BlogForm = ({ createBlog }) => {
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
    });

    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
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
};

export default BlogForm;
