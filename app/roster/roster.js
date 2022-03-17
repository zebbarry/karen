const createRoster = () => {
  return {
    header: { calendar: "Weekday", person: "Person" },
    items: [
      { calendar: "Monday", person: "Zeb" },
      { calendar: "Tuesday", person: "Emma" },
      { calendar: "Wednesday", person: "Komal" },
      { calendar: "Thursday", person: "Reece" },
      { calendar: "Friday", person: "Morgan" },
    ],
  };
};

export { createRoster };
