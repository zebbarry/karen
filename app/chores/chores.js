import { DateTime } from "luxon";
import fs from "fs";

const chores = [];
const desired_server_timezone = "Pacific/Auckland";
const week_start_date = 1; // MONDAY

const initial_roster = JSON.parse(
  fs.readFileSync("app/chores/initial_assignments.json").toString()
);
console.log(`Loaded initial assignments from ${initial_roster.date}`);
console.log(initial_roster.chores);

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

const calcWeeksSinceStart = (start_date, current_date) => {
  return Math.floor(current_date.diff(start_date, ["weeks"]).weeks);
};

const rotateRosterToCurrentDate = (current_date) => {
  const initial_date = DateTime.fromISO(initial_roster.date, {
    zone: desired_server_timezone,
  });
  const weeks_since_init = calcWeeksSinceStart(initial_date, current_date);
  console.log(`Shifting initial chore assignments ${weeks_since_init} weeks`);
  rotateRoster(weeks_since_init);
};

const calcMSecTillNextWeek = (current_date, week_start_date) => {
  const start_of_next_week = current_date
    .plus({ weeks: 1 })
    .set({ weekday: week_start_date, hour: 0, minute: 0, second: 0 });
  return start_of_next_week.diff(current_date, ["milliseconds"]).milliseconds;
};

const initRoster = () => {
  const current_date = DateTime.now().setZone(desired_server_timezone);
  console.log("Resetting roster");
  updateRoster(initial_roster.chores);

  rotateRosterToCurrentDate(current_date);

  // Reinit at start of next week
  const msec_till_next_week = calcMSecTillNextWeek(
    current_date,
    week_start_date
  );
  setInterval(() => {
    console.log("It's the start of a new week! Reinitialising roster...");
    initRoster();
  }, msec_till_next_week);
};

export default { initRoster, getRoster, rotateRoster, updateRoster };
