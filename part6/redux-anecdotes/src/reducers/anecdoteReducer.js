import { createSlice } from '@reduxjs/toolkit';
import { setNotification, clearNotification } from './notificationReducer';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload;
      const anecdoteToVote = state.find(anecdote => anecdote.id === id);
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1;
      }
      return state.sort((a, b) => b.votes - a.votes);
    },
    addAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
});

export const { voteAnecdote, addAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const voteAnecdoteAsync = (id) => (dispatch) => {
  dispatch(voteAnecdote(id));
  dispatch(setNotification(`You voted for anecdote ${id}`));

  setTimeout(() => {
    dispatch(clearNotification());
  }, 5000);
};

export const createAnecdoteAsync = (newAnecdote) => (dispatch) => {
  dispatch(addAnecdote(newAnecdote));
  dispatch(setNotification(`You created a new anecdote: ${newAnecdote.content}`));

  setTimeout(() => {
    dispatch(clearNotification());
  }, 5000);
};

export default anecdoteSlice.reducer;
