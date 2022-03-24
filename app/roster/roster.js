const roster = [
  { calendar: "Monday", person: "Zeb" },
  { calendar: "Tuesday", person: "Emma" },
  { calendar: "Wednesday", person: "Komal" },
  { calendar: "Thursday", person: "Reece" },
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
    type: "Chore",
    items: roster,
  };
};

export default { getRoster };
