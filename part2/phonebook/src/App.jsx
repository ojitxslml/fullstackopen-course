import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import axios from "axios";
import personsService from "./services/persons";

const App = () => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchText, setSearchText] = useState("");
  const [persons, setPersons] = useState([])
  const [filteredPersons, setFilteredPersons] = useState([]);
  
  useEffect(() => {
    console.log('effect')
    
    personsService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setFilteredPersons(initialPersons)
      })
  }, [])

  const handleAdd = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        personsService
          .update(existingPerson.id, newPerson)
          .then((returnedPerson) => {
            setPersons(persons.map((person) => (person.id !== existingPerson.id ? person : returnedPerson)));
            setFilteredPersons(persons.map((person) => (person.id !== existingPerson.id ? person : returnedPerson)));
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            alert(`The contact '${existingPerson.name}' was already deleted from the server.`);
            setPersons(persons.filter((person) => person.id !== existingPerson.id));
            setFilteredPersons(filteredPersons.filter((person) => person.id !== existingPerson.id));
          });
      }
    } else {
      personsService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setFilteredPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Please, confirm this action.")) {
      personsService
        .destroy(id)
        .then(() => {
          const updatedPersons = persons.filter((person) => person.id !== id);
          setPersons(updatedPersons);
          setFilteredPersons(
            updatedPersons.filter((person) =>
              person.name.toLowerCase().includes(searchText.toLowerCase())
            )
          );
        })
        .catch((error) => {
          alert(`The person was already deleted from server.`);
        });
    }
  };

  const handleInputName = (event) => {
    setNewName(event.target.value);
  };

  const handleInputNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleInputSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);

    setFilteredPersons(
      persons.filter((person) =>
        person.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleInputSearch={handleInputSearch} searchText={searchText} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleInputName={handleInputName}
        handleInputNumber={handleInputNumber}
        handleAdd={handleAdd}
      />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
