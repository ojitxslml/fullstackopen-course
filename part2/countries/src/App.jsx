import { useEffect, useState } from "react";
import countriesService from "./services/countries";
import axios from "axios";

const Countries = ({ countries, handleShow }) => {
  return (
    <div>
      {countries.length > 0 ? (
        countries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countries.length === 1 ? (
          <div>
            <h1>{countries[0].name.common}</h1>
            <p>capital: {countries[0].capital[0]}</p>
            <p>area: {countries[0].area}</p>
            <p>languages:</p>
            <ul>
              {Object.values(countries[0].languages).map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
            <img
              src={countries[0].flags.png}
              alt={`${countries[0].name.common} flag`}
            />
            <Weather country={countries[0].name.common} />
          </div>
        ) : (
          countries.map((country) => (
            <div key={country.name.common}>
              <p>
                {country.name.common}{" "}
                <button onClick={() => handleShow(country)}>show</button>
              </p>
            </div>
          ))
        )
      ) : (
        <p>No countries found</p>
      )}
    </div>
  );
};

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const api_key = import.meta.env.VITE_API_KEY;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=${api_key}`
      )
      .then((response) => {
        setWeatherData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not fetch weather data");
        setLoading(false);
      });
  }, [country]);

  if (loading) {
    return <p>Loading weather data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return weatherData ? (
    <div>
      <h1>Weather in {country}</h1>
      <p>temperature: {weatherData.main.temp}°C</p>
      <p>weather: {weatherData.weather[0].description}</p>
      <img
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
        alt={`${country} weather icon`}
      />
      <p>wind: {weatherData.wind.speed} m/s</p>
    </div>
  ) : null;
};

function App() {
  const [searchText, setSearchText] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    console.log("effect");

    countriesService.getAll().then((initialCountries) => {
      setCountries(initialCountries);
      setFilteredCountries(initialCountries);
      console.log(initialCountries);
    });
  }, []);

  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCountries(filtered);
    setSelectedCountry(null);
  };

  return (
    <div>
      <p>
        find countries:{" "}
        <input type="text" value={searchText} onChange={handleChange} />
      </p>
      {selectedCountry ? (
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <p>capital: {selectedCountry.capital[0]}</p>
          <p>area: {selectedCountry.area}</p>
          <p>languages:</p>
          <ul>
            {Object.values(selectedCountry.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img
            src={selectedCountry.flags.png}
            alt={`${selectedCountry.name.common} flag`}
          />
          <Weather country={selectedCountry.name.common} />
        </div>
      ) : (
        <Countries countries={filteredCountries} handleShow={handleShow} />
      )}
    </div>
  );
}

export default App;
