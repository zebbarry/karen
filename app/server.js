import express from "express";
import bodyParser from "body-parser";
import { create } from "express-handlebars";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import roster from "./roster/roster.js";
import chores from "./chores/chores.js";
import wheel from "./wheel/wheel.js";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;
chores.initRoster();

const wheel_params = {
  segments: 5,
  circles: 2,
};

// log only 4xx and 5xx responses to console
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

// log all requests to access.log
app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const hbs = create({
  defaultLayout: "main",
  extname: ".hbs",
  layoutsDir: __dirname,
  partialsDir: ["roster", "wheel", "chores", "."].map((view) =>
    path.join(__dirname, view)
  ),
  helpers: {
    ifeq: function (a, b, opts) {
      if (a === b)
        // Or === depending on your needs
        return opts.fn(this);
      else return opts.inverse(this);
    },
  },
});

app.engine(".hbs", hbs.engine);

app.set("view engine", ".hbs");
app.set(
  "views",
  ["roster", "wheel", "chores", "."].map((view) => path.join(__dirname, view))
);

app.get("/", (request, response) => {
  response.render("base", {
    roster: roster.getRoster(),
    chores: chores.getRoster(),
    edit: {
      enabled: true,
    },
    rotate: {
      url: "/rotate",
      enabled: false,
    },
  });
});

app.get("/roster", (request, response) => {
  response.json(roster.getRoster());
});

app.get("/chores", (request, response) => {
  response.json(chores.getRoster());
});

app.put("/update-chores", (request, response) => {
  console.log(`Received chores update from ${request.hostname}`);
  //Check if all fields are provided and are valid:
  let req_valid = true;
  for (const element in request.body) {
    if (
      !element.toString().match(/^[A-Za-z ]+$/g) ||
      !request.body[element].toString().match(/^[A-Za-z ]+$/g)
    ) {
      req_valid = false;
    }
  }
  if (!req_valid) {
    response.status(400);
    response.json({ message: "Invalid Chores Roster" });
  } else {
    const new_chores = chores.updateRoster(request.body);
    response.json({
      message: "Chores updated.",
      chores: new_chores,
      location: "/chores",
    });
  }
});

app.get("/rotate", (request, response) => {
  console.log(`Chores rotated by ${request.hostname}`);
  chores.rotateRoster(1);
  response.redirect("/");
});

app.get("/wheel", (request, response) => {
  response.render(
    "wheel",
    wheel.createWheel(wheel_params.circles, wheel_params.segments)
  );
});

// Error Handler
app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
