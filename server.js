// const http = require("http");
// const fs = require("fs").promises;

// const host = "localhost";
// const port = 8000;

// const requestListener = function (req, res) {
//   fs.readFile(__dirname + "/public/index.html").then((contents) => {
//     res.setHeader("Content-Type", "text/html");
//     res.writeHead(200);
//     res.end(contents);
//   });
// };

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//   console.log(`Server is running on http://${host}:${port}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public"));
});

const port = process.env.PORT || 3000; // this can be very useful if you deploy to Heroku!
app.listen(port, function () {
  console.log("Knock, knock");
  console.log("Who's there?");
  console.log(`Your server, listening on port ${port}`);
});

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});
