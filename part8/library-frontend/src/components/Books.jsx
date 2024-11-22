import { useState } from "react";
import { ALL_BOOKS, BOOK_ADDED } from "../queries";
import { useQuery, useSubscription, useApolloClient } from "@apollo/client";

const Books = ({ notify }) => {
  const [genre, setGenre] = useState(null);
  const client = useApolloClient();

  // Consulta inicial de todos los libros
  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre },
    notifyOnNetworkStatusChange: true, // Asegura que la UI se actualice durante el refetch
  });
  console.log('Data from query:', data);

  // Función para actualizar la caché cuando se agrega un nuevo libro
  const updateCache = (cache, addedBook, genre) => {
    // Función para asegurarse de que no haya duplicados en la lista de libros
    const uniqByTitle = (a) => {
      let seen = new Set();
      return a.filter((item) => {
        let k = item.title;
        return seen.has(k) ? false : seen.add(k);
      });
    };

    // Leer la caché usando el valor de `genre` actual
    const existingBooks = cache.readQuery({ query: ALL_BOOKS, variables: { genre } })?.allBooks;

    // Si el género coincide, agregar el nuevo libro a la lista de libros
    if (genre === addedBook.genres[0]) {
      // Escribir la caché actualizada con el libro agregado
      cache.writeQuery({
        query: ALL_BOOKS,
        variables: { genre },
        data: {
          allBooks: uniqByTitle(existingBooks.concat(addedBook)),
        },
      });
    }
  };

  // Suscripción a los libros agregados
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      // Mostrar notificación al usuario
      notify(`${addedBook.title} added`);
      // Actualizar la caché con el libro recién agregado
      updateCache(client.cache, addedBook, genre);
      // Refrescar la consulta para asegurarnos que la lista esté actualizada con el nuevo libro
      refetch({ genre });
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Los libros se extraen de los datos obtenidos
  const books = data?.allBooks || [];

  // Generar lista de géneros únicos
  const genres = books.reduce((acc, book) => {
    book.genres.forEach((g) => {
      if (!acc.includes(g)) {
        acc.push(g);
      }
    });
    return acc;
  }, []);

  const handleGenre = (g) => {
    setGenre(g);
    refetch({ genre: g });
  };

  const handleAllGenres = () => {
    setGenre(null);
    refetch({ genre: null });
  };

  return (
    <div>
      <h2>Books</h2>
      <div>
        <button onClick={handleAllGenres}>All genres</button>
        {genres.map((g) => (
          <button key={g} onClick={() => handleGenre(g)}>
            {g}
          </button>
        ))}
      </div>
      {genre && <p>In genre: <b>{genre}</b></p>}
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.length > 0 ? (
            books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No books available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
