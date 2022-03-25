const calcNewIndex = (current, direction, min, max) => {
  const new_index = current + direction;
  if (new_index > max) {
    return min;
  }
  if (new_index < min) {
    return max;
  }
  return new_index;
};

const moveCellContent = (cells, current_index, direction) => {
  const new_index = calcNewIndex(current_index, direction, 0, cells.length - 1);
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

const compileChores = (chores_pairs) => {
  let chores = {};
  for (const pair of chores_pairs) {
    const chore = pair.getElementsByClassName("chore")[0];
    const person = pair.getElementsByClassName("person")[0];
    chores[chore.textContent] = person.textContent;
  }
  return chores;
};

const edit_button = document.getElementById("edit");
const save_button = document.getElementById("save");
const modify_cells = document.getElementsByClassName("modify-chore");

const chores_table = document.getElementById("chore-table");
const chore_pairs = chores_table.getElementsByClassName("chore-pair");

[...chore_pairs].forEach(addMoveCallbacks);

const setModifyState = (enabled) => {
  edit_button.disabled = enabled;
  save_button.disabled = !enabled;
  for (const cell of modify_cells) {
    cell.hidden = !enabled;
  }
};

edit_button.addEventListener("click", () => {
  setModifyState(true);
});

save_button.addEventListener("click", () => {
  setModifyState(false);
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", "/update-chores", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(compileChores(chore_pairs)));
});
