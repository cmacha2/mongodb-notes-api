const express = require("express");
const Note = require("../models/Note");
const cors = require("cors");
const notFound = require("../middleware/notFound");
const handleErrors = require("../middleware/handleErrors");
const api = require("@serverless/cloud");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const app = express();

app.use(cors());
app.use(express.json());

Sentry.init({
  dsn: "https://877cb6c85be547bab38a51071eaa1c79@o1298315.ingest.sentry.io/6528526",
  // or pull from params
  // dsn: params.SENTRY_DSN,
  // environment: params.INSTANCE_NAME,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  // or pull from params
  // tracesSampleRate: parseFloat(params.SENTRY_TRACES_SAMPLE_RATE),
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get("/api/notes", (req, res, next) => {
  Note.find({})
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res, next) => {
  const note = req.body;

  if (!note.content) {
    return res.status(400).json({ error: 'requiered "content" field missing' });
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false,
  });
  newNote
    .save()
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

app.get("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then((note) => {
      return note
        ? res.json(note)
        : res.status(400).json({ error: "id used is malformed" }).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;

  Note.findByIdAndDelete(id)
    .then((note) => {
      return note
        ? res.status(204).end()
        : res.status(400).json({ error: "id used is malformed" }).end();
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  const note = req.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }) //=> devuelve por defecto el valor que encontro no el actualizado
    .then((noteUpdate) => {
      res.json(noteUpdate);
    })
    .catch((error) => next(error));
});

app.use(notFound);
app.use(Sentry.Handlers.errorHandler());
app.use(handleErrors);

module.exports = app;
