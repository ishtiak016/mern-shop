const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routes/userRouter");
const seedRouter = require("./routes/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routes/authRouter");
const app = express();

const limiter = rateLimit({
  windowMs: 11 * 60 * 1000, // 1 minutes
  limit: 50, // Limit each IP to 5 requests per `window` (here, per 1 minutes).
  // standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // // store: ... , // Redis, Memcached, etc. See below.
  message: "Limit each IP to 5 requests per `window` (here, per 1 minutes)",
});
// Use body-parsing middleware
app.use(bodyParser.json()); // Built-in middleware in Express 4.16.0 and later
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(morgan("dev"));
app.use(xss());
app.use(limiter);
app.get("/test", (req, res) => {
  res.status(200).send({
    message: "Api test is Working fine",
  });
});
app.use(cookieParser());
app.use("/api/users", userRouter);
app.use("/api/auth",authRouter)
app.use("/api/seed", seedRouter);

//client error handle
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});
//server error handle
app.use((err, req, res, next) => {
  return errorResponse(res,{
    statusCode:err.status,
    message:err.message,
  })
});
module.exports = app;
