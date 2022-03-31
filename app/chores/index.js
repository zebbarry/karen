const calcNewIndex = (current, shift, range) => {
  if (shift < 0) {
    shift = range - shift - 1;
  }
  return (current + shift) % (range + 1);
};

const moveCellContent = (cells, current_index, direction) => {
  const new_index = calcNewIndex(current_index, direction, cells.length - 1);
  const current_cell = cells[current_index].getElementsByClassName("chore")[0];
  const new_cell = cells[new_index].getElementsByClassName("chore")[0];
  // Swap text content
  [current_cell.textContent, new_cell.textContent] = [
    new_cell.textContent,
    current_cell.textContent,
  ];
};

const addMoveCallbacks = (row, index) => {
  const up = row.getElementsByClassName("up")[0];
  up.addEventListener("click", () => {
    moveCellContent(chore_pairs, index, -1);
  });
  const down = row.getElementsByClassName("down")[0];
  down.addEventListener("click", () => {
    moveCellContent(chore_pairs, index, +1);
  });
};

const compileAssignments = (chores_pairs) => {
  let assignments = {};
  for (const pair of chores_pairs) {
    const chore = pair.getElementsByClassName("chore")[0];
    const person = pair.getElementsByClassName("person")[0];
    assignments[person.textContent] = chore.textContent;
  }
  return assignments;
};

const cancel_button = document.getElementById("cancel");
const edit_button = document.getElementById("edit");
const save_button = document.getElementById("save");
const modify_cells = document.getElementsByClassName("modify-chore");

const chores_table = document.getElementById("chore-table");
const chore_pairs = chores_table.getElementsByClassName("chore-pair");

[...chore_pairs].forEach(addMoveCallbacks);

const setModifyState = (modify_enabled) => {
  cancel_button.hidden = !modify_enabled;
  edit_button.hidden = modify_enabled;
  save_button.disabled = !modify_enabled;
  for (const cell of modify_cells) {
    cell.hidden = !modify_enabled;
  }
};

edit_button.addEventListener("click", () => {
  setModifyState(true);
});

cancel_button.addEventListener("click", () => {
  window.location.href = "/";
});

save_button.addEventListener("click", () => {
  setModifyState(false);
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", "/update-chores", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(compileAssignments(chore_pairs)));
});
