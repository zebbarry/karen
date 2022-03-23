import express from "express";
import { engine, create } from "express-handlebars";
import path from "path";
import { getRoster } from "./roster/roster.js";
import { getChoreRoster, rotateRoster } from "./chores/chores.js";
import { createWheel } from "./wheel/wheel.js";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
console.log(__dirname);

const app = express();
const port = 18081;

const wheel_params = {
  segments: 5,
  circles: 2,
};

const hbs = create({
  defaultLayout: "main",
  extname: ".hbs",
  layoutsDir: __dirname,
  partialsDir: ["roster", "wheel", "chores", "."].map((view) =>
    path.join(__dirname, view)
  ),
  helpers: {
    ifeq: function(a, b, opts) {
      if(a === b) // Or === depending on your needs
          return opts.fn(this);
      else
          return opts.inverse(this);
    }
  }
});

app.engine(".hbs", hbs.engine);

app.set("view engine", ".hbs");
app.set(
  "views",
  ["roster", "wheel", "chores", "."].map((view) => path.join(__dirname, view))
);

app.get("/", (request, response) => {
  response.render("base", {
    roster: getRoster(),
    chores: getChoreRoster(),
    rotate: {
      url: "/rotate",
      disabled: false,
    }
  });
});

app.get("/roster", (request, response) => {
  response.render("roster", { roster: getRoster() });
});

app.get("/chores", (request, response) => {
  response.render("chores", {
    roster: getChoreRoster(),
    rotate_url: "/rotate",
  });
});

app.get("/rotate", (request, response) => {
  rotateRoster();
  response.redirect("/");
});

app.get("/wheel", (request, response) => {
  response.render(
    "wheel",
    createWheel(wheel_params.circles, wheel_params.segments)
  );
});

// Error Handler
app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Listening at http://192.168.1.100:${port}`);
}).ad;
