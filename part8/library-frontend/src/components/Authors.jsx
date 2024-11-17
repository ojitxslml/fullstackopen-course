import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const Authors = ({ setError }) => {
  const result = useQuery(ALL_AUTHORS);
  const authors = result.data?.allAuthors;
  const [name, setName] = useState();
  const [born, setBorn] = useState();

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log(messages)
      setError(messages);
    },
  });

  useEffect(() => {
    if (result.data && result.data.editBook === null) {
      setError('person not found')
    }
  }, [result.data])
  
  if (result.loading) {
    return <div>loading...</div>;
  }

  const submit = (event) => {
    event.preventDefault();

    editAuthor({ variables: { name, born: parseInt(born, 10) } });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={submit}>
        <div>
          Name
          <select
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
           {authors.map((a) => (
        <option key={a.id} value={a.name}>
          {a.name}
        </option>
      ))}
          </select>
        </div>
        <div>
          Born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
