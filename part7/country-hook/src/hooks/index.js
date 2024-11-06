import { useState, useEffect } from 'react';
import axios from 'axios';

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange
  };
};

export const useCountry = (name) => {
  const [country, setCountry] = useState({ found: null, data: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (name === '') {
      setCountry({ found: null, data: null });
      return;
    }

    const fetchCountry = async () => {
      try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
        setCountry({ found: true, data: response.data[0] });
        setError(null);
        console.log(response)
      } catch (err) {
        setCountry({ found: false, data: null });
        setError('Country not found');
      }
    };

    fetchCountry();
  }, [name]);

  return { country, error };
};
