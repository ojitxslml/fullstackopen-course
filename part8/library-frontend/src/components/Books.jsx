import { useState } from "react";
import { ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client";

const Books = () => {
  const [genre, setGenre] = useState(null);

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre },
    notifyOnNetworkStatusChange: true, // Asegura que la UI se actualice durante el refetch
  });

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const books = data?.allBooks;

  const genres = books?.reduce((acc, book) => {
    book.genres.forEach((g) => {
      if (!acc.includes(g)) {
        acc.push(g);
      }
    });
    return acc;
  }, []);

  const handleGenre = (g) => {
    setGenre(g);
    //refetch para obtener los datos actualizados
    refetch({ genre: g });
  };

  const handleAllGenres = () => {
    setGenre(null);
    refetch({ genre: null }); // Refetch con null para obtener todos los libros
  };

  return (
    <div>
      <h2>Books</h2>
      <div>
        <button onClick={handleAllGenres}>All genres</button>
        {genres?.map((g) => (
          <button key={g} onClick={() => handleGenre(g)}>
            {g}
          </button>
        ))}
      </div>
      {genre && (
        <p>
          In genre: <b>{genre}</b>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((a) => (
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

export default Books;
