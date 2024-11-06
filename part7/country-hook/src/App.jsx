import React, { useState } from 'react';
import { useField, useCountry } from './hooks';

const App = () => {
  const nameInput = useField('text');
  const [name, setName] = useState('');
  const { country, error } = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      {error && <div>{error}</div>}

      {country.found && (
        <div>
          <h3>{country.data.name.common}</h3>
          <div>capital {country.data.capital}</div>
          <div>population {country.data.population}</div>
          <img src={country.data.flags.png} height="100" alt={`flag of ${country.data.name.common}`} />
        </div>
      )}
      {!country.found && country.found !== null && <div>not found...</div>}
    </div>
  );
};

export default App;
