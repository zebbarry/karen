import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { createRoster } from "./roster/roster.js";
import { createWheel } from "./wheel/wheel.js";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
console.log(__dirname);

const app = express();
const port = 3000;

app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: __dirname,
  })
);
app.set("view engine", ".hbs");
app.set(
  "views",
  ["roster", "wheel"].map((view) => path.join(__dirname, view))
);

app.get("/roster", (request, response) => {
  response.render("roster", createRoster());
});

app.get("/wheel", (request, response) => {
  response.render("wheel", createWheel(2, 5));
});

// Error Handler
app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Listening at http://192.168.1.100:${port}`);
}).ad;
