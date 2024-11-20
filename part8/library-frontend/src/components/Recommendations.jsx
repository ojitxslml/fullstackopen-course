import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ALL_BOOKS, ME } from "../queries";

const Recommendations = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);

  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
  } = useQuery(ALL_BOOKS);

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(ME);

  useEffect(() => {
    if (booksData && userData?.me?.favoriteGenre) {
      const filtered = booksData.allBooks.filter((book) =>
        book.genres.includes(userData.me.favoriteGenre)
      );
      setFilteredBooks(filtered);
    }
  }, [booksData, userData]);

  if (booksLoading || userLoading) {
    return <div>Loading...</div>;
  }

  if (booksError || userError) {
    return <div>Error: {booksError?.message || userError?.message}</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{userData?.me?.favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
