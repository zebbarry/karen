import { DateTime, Info } from "luxon";
import fs from "fs";

const chores = [];

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

const updateRoster = (new_assignments) => {
  chores.length = 0;
  for (const person in new_assignments) {
    chores.push({ chore: new_assignments[person], person: person });
  }
  console.log(chores);
  return chores;
};

const rotateRosterToCurrentDate = (current_date, initial_date) => {
  const weeks_since_init = Math.floor(
    current_date.diff(initial_date, ["weeks"]).weeks
  );
  console.log(`Shifting initial chore assignments ${weeks_since_init} weeks`);
  rotateRoster(weeks_since_init);
};

const calcMSecTillNextOccurrence = (current_date, day_config) => {
  let next_occurrence = current_date.set(day_config);
  // Has already occurred
  if (current_date > next_occurrence) {
    next_occurrence = next_occurrence.plus({ weeks: 1 });
  }
  return next_occurrence.toMillis() - current_date.toMillis();
};

const weeklyRotation = (initial_roster, week_start, timezone) => {
  (function loop() {
    const current_date = DateTime.now().setZone(timezone);
    updateRoster(initial_roster.chores);
    rotateRosterToCurrentDate(current_date, initial_roster.date);

    // Reinit at start of next week
    const msec_till_next_week = calcMSecTillNextOccurrence(
      current_date,
      week_start
    );
    setInterval(() => {
      console.log("It's the start of a new week! Reinitialising roster...");
      loop();
    }, msec_till_next_week);
  })();
};

const addChoreAction = (action, timezone, contact_details) => {
  (function loop() {
    const current_date = DateTime.now().setZone(timezone);
    const msec_till_action = calcMSecTillNextOccurrence(
      current_date,
      action.day
    );

    // Wait till next occurrence
    setTimeout(() => {
      const assignments = chores.filter(
        (assignment) => assignment.chore === action.chore
      );
      action.callback(assignments, action.meta, contact_details);
      loop();
    }, msec_till_action);
  })();
};

const initRoster = (config_file) => {
  // Load config file
  const config = JSON.parse(fs.readFileSync(config_file).toString());
  config.initial_roster.date = DateTime.fromISO(config.initial_roster.date, {
    zone: config.timezone,
  });
  console.log(
    `Loaded initial assignments from ${config.initial_roster.date.toLocaleString(
      DateTime.DATETIME_MED
    )}`
  );
  console.log(config.initial_roster.chores);

  // Setup weekly rotation
  const week_start_day = DateTime.fromObject(config.week_start);
  console.log(
    `Start of week configured for ${
      Info.weekdays()[week_start_day.weekday - 1]
    }s at ${week_start_day.toLocaleString(DateTime.TIME_WITH_SECONDS)}`
  );
  weeklyRotation(config.initial_roster, config.week_start, config.timezone);

  // Add actions
  config.actions.forEach((action) => {
    const date = DateTime.fromObject(action.day);
    console.log(
      `Adding action for ${action.chore} on ${
        Info.weekdays()[date.weekday - 1]
      }s at ${date.toLocaleString(DateTime.TIME_WITH_SECONDS)}`
    );
    import(action.callback).then((callback) => {
      action.callback = callback.default;
      addChoreAction(action, config.timezone, config.details);
    });
  });
};

export default { initRoster, getRoster, rotateRoster, updateRoster };
