const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require('./config/corsOptions')
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false })); //Used to handle form data.

app.use(express.json()); //Used to handle json data from frontend.

app.use('/', express.static(path.join(__dirname, "./public")));
// app.use('/subdir', express.static(path.join(__dirname, "./public")));


app.use('/', require('./routes/root'))
// app.use("/subdir", require("./routes/subdir"));

app.use("/employees", require("./routes/api/employees"));


app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "404.html"));
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
