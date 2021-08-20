const express = require("express");
const path = require("path");
const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public"));
});

const port = process.env.PORT || 3000; 
app.listen(port, function () {
});

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});
