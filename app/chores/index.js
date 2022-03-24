const moveChoreUp = (row) => {
  previous_row = row.previousElementSibling;
  previous_chore = previous_row.getElementsByClassName("chore")[0];
  current_chore = row.getElementsByClassName("chore")[0];
  temp = previous_chore.textContent;
  previous_chore.textContent = current_chore.textContent;
  current_chore.textContent = temp;
};

const moveChoreDown = (row) => {
  previous_row = row.nextElementSibling;
  previous_chore = previous_row.getElementsByClassName("chore")[0];
  current_chore = row.getElementsByClassName("chore")[0];
  temp = previous_chore.textContent;
  previous_chore.textContent = current_chore.textContent;
  current_chore.textContent = temp;
};

const chores_table = document.getElementById("chore-table");

for (const row of chores_table.getElementsByClassName("chore-pair")) {
  let up = row.getElementsByClassName("up")[0];
  up.addEventListener("click", () => {
    moveChoreUp(row);
  });
  let down = row.getElementsByClassName("down")[0];
  down.addEventListener("click", () => {
    moveChoreDown(row);
  });
}

const compileChores = (table) => {
  let chores = {};
  for (const row of table.getElementsByClassName("chore-pair")) {
    chore = row.getElementsByClassName("chore")[0];
    person = row.getElementsByClassName("person")[0];
    chores[chore.textContent] = person.textContent;
  }
  return chores;
};

const setModifyState = (enabled) => {
  edit_button.disabled = enabled;
  save_button.disabled = !enabled;
  for (const cell of document.getElementsByClassName("modify-chore")) {
    cell.hidden = !enabled;
  }
};

const edit_button = document.getElementById("edit");
const save_button = document.getElementById("save");

edit_button.addEventListener("click", () => {
  setModifyState(true);
});

save_button.addEventListener("click", () => {
  setModifyState(false);
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "/update-chores", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(compileChores(chores_table)));
});
