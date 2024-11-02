import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';
import { useNotificationDispatch } from '../contexts/NotificationContext';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || [];
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote));

      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: `You created "${newAnecdote.content}"`,
      });

      setTimeout(() => {
        notificationDispatch({ type: "CLEAR_NOTIFICATION" });
      }, 5000);
    },
    onError:()=>{ notificationDispatch({
      type: "SET_NOTIFICATION",
      payload: `too short anecdote, must have length 5 or more"`,
    });

    setTimeout(() => {
      notificationDispatch({ type: "CLEAR_NOTIFICATION" });
    }, 5000);
  }
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
};

export default AnecdoteForm;
