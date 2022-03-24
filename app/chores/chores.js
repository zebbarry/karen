const chores = [
  { chore: "Bins", person: "Komal" },
  { chore: "Vacuum", person: "Emma" },
  { chore: "Kitchen", person: "Morgan" },
  { chore: "Lounge", person: "Zeb" },
  { chore: "Mop", person: "Reece" },
];

const getRoster = () => {
  return {
    type: "Chore",
    items: chores,
  };
};

const rotateRoster = () => {
  let prev_chore = chores[chores.length - 1].chore;
  let curr_chore;
  for (const chore_assignment of chores) {
    curr_chore = chore_assignment.chore;
    chore_assignment.chore = prev_chore;
    prev_chore = curr_chore;
  }
  console.log("Rotated roster:");
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

export default { getRoster, rotateRoster, updateRoster };
