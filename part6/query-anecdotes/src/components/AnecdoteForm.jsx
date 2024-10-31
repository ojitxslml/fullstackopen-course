import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || [];
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote));
    },
  });

  const addAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';

    const newAnecdote = {
      content,
      id: Math.floor(Math.random() * 1000000),
      votes: 0,
    };
    
    newAnecdoteMutation.mutate(newAnecdote);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
}

export default AnecdoteForm;
