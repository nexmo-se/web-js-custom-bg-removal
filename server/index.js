require("dotenv").config();

// For non-Neru deployment
// const PORT = process.env.PORT;
// const PROJECT_API_KEY = process.env.PROJECT_API_KEY;
// const PROJECT_API_SECRET = process.env.PROJECT_API_SECRET;
// const BASE_URL = process.env.BASE_URL;

// For Neru deployment
const PORT = process.env.NERU_APP_PORT;
// const { PROJECT_API_KEY, PROJECT_API_SECRET, BASE_URL } = JSON.parse(process.env.NERU_CONFIGURATIONS);

const VERSION = "230720241440";
console.log("VERSION ", VERSION);

var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.get("/up", (req, res) => {
  res.sendStatus(200);
});

app.get('/_/metrics', async (req, res) => {
  res.sendStatus(200);
});

app.get('/_/health', async (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});