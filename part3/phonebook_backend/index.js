const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use(morgan("tiny"));
const Person = require("./models/person");
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/person", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/person/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  Person.countDocuments({})
    .then((quantity) => {
      const date = new Date();
      response.send(
        `<p>Phonebook has info of ${quantity} people</p><p>${date.toString()}</p>`
      );
    })
    .catch((error) => {
      response.status(500).json({ error: "Error retrieving data" });
    });
});

app.post("/api/person", (request, response, next) => {
  const body = request.body;

  if (!body.name && !body.number) {
    return response.status(400).json({ error: "name and number missing" });
  } else if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  } else if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  }

  Person.findOne({ name: body.name }).then((existingPerson) => {
    if (existingPerson) {
      return response.status(400).json({ error: "name must be unique" });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person
      .save()
      .then((savedPerson) => {
        response.status(201).json(savedPerson);
      })
      .catch((error) => next(error));
  });
});

app.delete("/api/person/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        response.status(204).end(); // 204 No Content, la eliminación fue exitosa
      } else {
        response.status(404).json({ error: "person not found" });
      }
    })
    .catch((error) => next(error));
});

app.put("/api/person/:id", (request, response) => {
  const { name, number } = request.body;

  if (!name && !number) {
    return response.status(400).json({ error: "name and number missing" });
  }

  const updatedPerson = { name, number };

  Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).json({ error: "person not found" });
      }
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
