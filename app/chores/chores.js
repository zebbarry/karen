import { DateTime } from "luxon";
import fs from "fs";
const initial_roster = JSON.parse(
  fs.readFileSync("app/chores/initial_assignments.json").toString()
);
const chores = initial_roster.chores;

const getRoster = () => {
  return {
    type: "Chore",
    items: chores,
  };
};

const rotateRoster = (rotations) => {
  for (let i = 0; i < rotations; i++) {
    let prev_chore = chores[chores.length - 1].chore;
    let curr_chore;
    for (const chore_assignment of chores) {
      curr_chore = chore_assignment.chore;
      chore_assignment.chore = prev_chore;
      prev_chore = curr_chore;
    }
  }

  console.log(`Rotated roster ${rotations} times:`);
  console.log(chores);
};

const updateRoster = (new_chores) => {
  chores.length = 0;
  for (const chore in new_chores) {
    chores.push({ chore: chore, person: new_chores[chore] });
  }
  console.log(chores);
  return chores;
};

const initial_date = DateTime.fromISO(initial_roster.date, {
  zone: "Pacific/Auckland",
});
const current_date = DateTime.now().setZone("Pacific/Auckland");
const weeks_since_init = Math.floor(
  current_date.diff(initial_date, ["weeks"]).weeks
);
console.log(`Shifting initial chore assignments ${weeks_since_init} weeks`);
rotateRoster(weeks_since_init);

export default { getRoster, rotateRoster, updateRoster };
