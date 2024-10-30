import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdoteAsync } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const lowerCaseFilter = filter ? filter.toLowerCase() : '';
    return anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(lowerCaseFilter)
    );
  });

  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteAnecdoteAsync(id));
  };

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
