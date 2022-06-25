const express = require("express");
const cors = require("cors");
const notFound = require("../middleware/notFound");
const handleErrors = require("../middleware/handleErrors");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const app = express();
const userRouter = require("../controllers/users")
const noteRouter = require('../controllers/notes');
const loginRouter = require("../controllers/login");

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

// app.use(Sentry.Handlers.requestHandler());
// // TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.use('/api/notes', noteRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(notFound);
app.use(Sentry.Handlers.errorHandler());
app.use(handleErrors);

module.exports = app;
