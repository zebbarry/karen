const roster = {
  type: "Weekday",
  items: [
    { calendar: "Monday", person: "Zeb" },
    { calendar: "Tuesday", person: "Emma" },
    { calendar: "Wednesday", person: "Komal" },
    { calendar: "Thursday", person: "Reece" },
    { calendar: "Friday", person: "Morgan" },
  ],
};

const date = new Date;
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const getRoster = () => {
  let current = getCurrentPosition()
  roster.items.forEach(element => {
    element.current = element.calendar === weekday[current]
  });
  console.log(roster)
  return roster;
};

const getCurrentPosition = () => {
  return date.getDay()
};

export { getRoster };
