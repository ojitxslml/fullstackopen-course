import { createSlice } from '@reduxjs/toolkit';
import { setNotificationWithTimeout } from './notificationReducer';
import anecdoteService from '../services/anecdotes';

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
      return action.payload;
    }
  },
});

export const { voteAnecdote, addAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    const sortedAnecdotes = anecdotes.sort((a, b) => b.votes - a.votes);
    dispatch(setAnecdotes(sortedAnecdotes));
  };
};

export const voteAnecdoteAsync = (id) => {
  return async (dispatch, getState) => {
    const anecdotes = getState().anecdotes;
    const anecdoteToVote = anecdotes.find(anecdote => anecdote.id === id);

    if (anecdoteToVote) {
      const updatedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      };
      const response = await anecdoteService.updateVotes(id, updatedAnecdote);

      dispatch(voteAnecdote(response.id));
      dispatch(setNotificationWithTimeout(`You voted for anecdote "${response.content}"`, 5));
    }
  };
};

export const createAnecdoteAsync = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(addAnecdote(newAnecdote));
    dispatch(setNotificationWithTimeout(`You created a new anecdote: "${newAnecdote.content}"`, 5));
  };
};

export default anecdoteSlice.reducer;
