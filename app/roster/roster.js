import { DateTime } from "luxon";

const roster = [
  { calendar: "Monday", person: "Zeb" },
  { calendar: "Tuesday", person: "Emma" },
  { calendar: "Wednesday", person: "Reece" },
  { calendar: "Thursday", person: "Komal" },
  { calendar: "Friday", person: "Morgan" },
];

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getCurrentPosition = () => {
  return DateTime.now().setZone("Pacific/Auckland").weekday;
};

const getRoster = () => {
  let current = getCurrentPosition();
  roster.forEach((element) => {
    element.current = element.calendar === weekdays[current];
  });
  return {
    type: "Weekday",
    items: roster,
  };
};

export default { getRoster };
