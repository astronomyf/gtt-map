const express = require("express");
const routes = require("./routes");
const api = require("./routes/api");

const app = express();

const port = process.env.PORT || 3000;

app.use("/", routes);
app.use("/api", api);
app.use((req, res, next) => {
  res.status(404).send("<h3>The requested page does not exist.</h3>");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
