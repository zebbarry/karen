const roster = [
  { calendar: "Monday", person: "Zeb" },
  { calendar: "Tuesday", person: "Emma" },
  { calendar: "Wednesday", person: "Reece" },
  { calendar: "Thursday", person: "Komal" },
  { calendar: "Friday", person: "Morgan" },
];

const date = new Date();
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getCurrentPosition = () => {
  return date.getDay();
};

const getRoster = () => {
  let current = getCurrentPosition();
  roster.forEach((element) => {
    element.current = element.calendar === weekday[current];
  });
  return {
    type: "Weekday",
    items: roster,
  };
};

export default { getRoster };
