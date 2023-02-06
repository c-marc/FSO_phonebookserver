require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

// json parser must be one of the first otherwise request.body will be undefined
app.use(express.json());

//access frontend static in build
app.use(express.static("build"));

// middleware just some info
app.use(morgan("tiny"));

app.use(cors());

/*
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
*/

// Hello
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// Info
app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const message = `Phonebook has info for ${persons.length} people`;
    const time = new Date().toString();
    response.send(`<p>${message}</p><p>${time}</p>`);
  });
});

// Get all
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

// Get one
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end(); //not found
      }
    })
    .catch((error) => next(error));
});

// Delete
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end(); // no content
    })
    .catch((error) => next(error));
});

// Add
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({
      error: "both name and number are required",
    });
  }

  /*
  if (persons.some((p) => p.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  */

  // use mongoose constructor
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  // respond in the callback = after success
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// Update
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// after all routes have been declared
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" }); //400 bad request
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
