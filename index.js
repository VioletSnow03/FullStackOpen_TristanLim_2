const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("content", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  }
  response.statusMessage = "No person found";
  response.status(404).end();
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people<p/>
  <p>${Date()}<p/>`);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    response.statusMessage = "Missing name field";
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    response.statusMessage = "Missing number field";
    return response.status(400).json({
      error: "number missing",
    });
  }
  if (
    persons.map((p) => p.name.toLowerCase()).includes(body.name.toLowerCase())
  ) {
    response.statusMessage = `${body.name} has already been added`;
    return response.status(409).json({
      error: "duplicate",
    });
  }

  const id = Math.floor(Math.random() * 1000000);
  const person = {
    id: id.toString(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
