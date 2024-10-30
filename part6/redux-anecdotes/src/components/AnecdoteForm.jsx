import { useDispatch } from 'react-redux';
import { createAnecdoteAsync } from '../reducers/anecdoteReducer';
import anecdoteService from '../services/anecdotes'
const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    const newNote = await anecdoteService.createNew(content)
    dispatch(createAnecdoteAsync(newNote))
  };

  return (
    <form onSubmit={addAnecdote}>
      <div><input name="anecdote" /></div>
      <button type="submit">create</button>
    </form>
  );
};

export default AnecdoteForm;
