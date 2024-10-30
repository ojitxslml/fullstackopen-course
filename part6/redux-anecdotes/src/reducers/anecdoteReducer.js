import { setNotification, clearNotification } from './notificationReducer';

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  };
};

const initialState = anecdotesAtStart.map(asObject);

const VOTE = 'VOTE';
const NEW_ANECDOTE = 'NEW_ANECDOTE';

export const voteAnecdote = (id) => {
  return async (dispatch) => {
    dispatch({
      type: VOTE,
      payload: { id },
    });
    dispatch(setNotification(`You voted for anecdote ${id}`));

    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = {
      content,
      id: getId(),
      votes: 0,
    };
    
    dispatch({
      type: NEW_ANECDOTE,
      payload: anecdote,
    });
    dispatch(setNotification(`You created a new anecdote: ${content}`));

    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };
};

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case VOTE:
      return state
        .map(anecdote =>
          anecdote.id === action.payload.id
            ? { ...anecdote, votes: anecdote.votes + 1 }
            : anecdote
        )
        .sort((a, b) => b.votes - a.votes);
    case NEW_ANECDOTE:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default anecdoteReducer;
