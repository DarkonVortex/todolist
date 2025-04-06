const API_URL = "http://192.168.1.135:3000/todos";
let tasks = [];

import { fetchTasks } from "./fetchTasks.js";
import { addTask } from "./addTask.js";
import { deleteTask } from "./deleteTask.js";
import { registerUser } from "./registerUser.js";

const modalContainer = document.getElementById("modalCreate");
const createButton = document.getElementById("createButton");
const backButton = document.getElementById("backButton");
const doneButton = document.querySelectorAll(".doneButton");
const newTask = document.getElementById("modalNewTask");

function displayTasks() {
  const list = document.querySelector(".ulList");
  list.innerHTML = "";

  if (tasks.length == 0) {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const hr = document.createElement("hr");

    div.textContent = "You are free from tasks...";
    div.className = "taskContent";

    li.appendChild(div);
    list.appendChild(li);
    list.appendChild(hr);
    return;
  }

  // create/display task
  tasks.forEach((task) => {
    const li = document.createElement("li");
    const x = document.createElement("div");
    const div = document.createElement("div");
    const hr = document.createElement("hr");

    div.textContent = task.title;
    div.className = "taskContent";
    div.id = task.id;
    x.textContent = "delete";
    x.className = "material-icons pointer deleteButton";

    li.appendChild(div);
    li.appendChild(x);
    list.appendChild(li);
    list.appendChild(hr);
  });

  // delete task
  const deleteButton = document.querySelectorAll(".deleteButton");

  deleteButton.forEach((element) => {
    element.addEventListener("click", (event) =>
      deleteTask(event, tasks, API_URL, displayTasks)
    );
  });

  console.log("Current tasks:", tasks);
}

// buttons
createButton.addEventListener("click", () => modalContainer.showModal());

doneButton.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      addTask(newTask, tasks, API_URL, modalContainer, displayTasks);
    } else {
      modalContainer.close();
    }
  });
});

backButton.addEventListener("click", () => modalContainer.close());
fetchTasks(API_URL, tasks, displayTasks);
