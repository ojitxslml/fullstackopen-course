import { useEffect, useState } from "react";
import { Entry, NewEntry, Visibility, Weather } from "./types";
import { createEntry, getAllEntries } from "./services/entryService";

function App() {
  const [newEntry, setNewEntry] = useState<NewEntry>({
    visibility: Visibility.Great,
    weather: Weather.Sunny,
    date: "",
    comment: "",
  });

  const [entries, setEntries] = useState<Entry[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getAllEntries()
      .then((data) => {
        setEntries(data);
      })
      .catch((error) => {
        setErrors({ fetch: error.message });
      });
  }, []);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!newEntry.date) {
      newErrors.date = "Date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const entryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    createEntry(newEntry)
      .then((data) => {
        setEntries([...entries, data]);
        setNewEntry({
          weather: Weather.Sunny,
          visibility: Visibility.Great,
          date: "",
          comment: "",
        });
        setErrors({});
      })
      .catch((error) => {
        setErrors({
          submission: error.message,
        });
      });
  };

  return (
    <div>
      <b>Add new Entry</b>
      <br />
      <br />
      <form onSubmit={entryCreation}>
        {Object.keys(errors).length > 0 && (
          <div style={{ color: "red", marginBottom: "15px" }}>
            <p>
              <strong>Please correct the following errors:</strong>
            </p>
            <ul>
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <label>
          Date:
          <input
            type="date"
            value={newEntry.date}
            onChange={(event) =>
              setNewEntry({ ...newEntry, date: event.target.value })
            }
            placeholder="Enter date"
          />
        </label>
        <br />
        <br />
        <div>
          <label>Visibility:</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {Object.values(Visibility).map((visibility) => (
              <div key={visibility}>
                <input
                  type="radio"
                  id={`visibility-${visibility}`}
                  name="visibility"
                  value={visibility}
                  checked={newEntry.visibility === visibility}
                  onChange={(event) =>
                    setNewEntry({
                      ...newEntry,
                      visibility: event.target.value as Visibility,
                    })
                  }
                />
                <label htmlFor={`visibility-${visibility}`}>{visibility}</label>
              </div>
            ))}
          </div>
        </div>
        <br />
        <div>
          <label>Weather:</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {Object.values(Weather).map((weather) => (
              <div key={weather}>
                <input
                  type="radio"
                  id={`weather-${weather}`}
                  name="weather"
                  value={weather}
                  checked={newEntry.weather === weather}
                  onChange={(event) =>
                    setNewEntry({
                      ...newEntry,
                      weather: event.target.value as Weather,
                    })
                  }
                />
                <label htmlFor={`weather-${weather}`}>{weather}</label>
              </div>
            ))}
          </div>
        </div>
        <br />
        <label>
          Comment:
          <input
            type="text"
            value={newEntry.comment}
            onChange={(event) =>
              setNewEntry({ ...newEntry, comment: event.target.value })
            }
            placeholder="Enter comment"
          />
        </label>
        <br />
        <br />
        <button type="submit">Add Entry</button>
      </form>
      <br />
      <b>Diary Entries</b>
      <br />
      <br />
      <div>
        {entries.map((entry) => (
          <div key={entry.id}>
            <b>{entry.date}</b>
            <br />
            <span>Weather: {entry.weather}</span>
            <br />
            <span>Visibility: {entry.visibility}</span>
            <br />
            {entry.comment && <span>Comment: {entry.comment}</span>}
            <br />
            <br />
          </div>
        ))}
      </div>
      <br />
    </div>
  );
}

export default App;
