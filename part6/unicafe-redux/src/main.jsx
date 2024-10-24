import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';

// Reducer
const initialState = {
  good: 0,
  ok: 0,
  bad: 0,
};

const feedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GOOD':
      return { ...state, good: state.good + 1 };
    case 'OK':
      return { ...state, ok: state.ok + 1 };
    case 'BAD':
      return { ...state, bad: state.bad + 1 };
    case 'ZERO':
      return initialState;
    default:
      return state;
  }
};

// Create Redux store
const store = createStore(feedbackReducer);

// Inicializa algunas estadísticas
store.dispatch({ type: 'GOOD' });
store.dispatch({ type: 'OK' });

// Componente App
const App = () => {
  const feedback = store.getState();

  return (
    <div>
      <h1>Give feedback</h1>
      <button onClick={() => store.dispatch({ type: 'GOOD' })}>good</button>
      <button onClick={() => store.dispatch({ type: 'OK' })}>ok</button>
      <button onClick={() => store.dispatch({ type: 'BAD' })}>bad</button>
      <button onClick={() => store.dispatch({ type: 'ZERO' })}>reset stats</button>

      <h2>Statistics</h2>
      <div>good {feedback.good}</div>
      <div>ok {feedback.ok}</div>
      <div>bad {feedback.bad}</div>
    </div>
  );
};

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(<App />);
};

// Subscribe to store updates
store.subscribe(renderApp);

// Initial render
renderApp();
