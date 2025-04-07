const API_URL = "http://192.168.1.135:3000/todos";
let tasks = [];

import { fetchTasks } from "./fetchTasks.js";
import { addTask } from "./addTask.js";
import { deleteTask } from "./deleteTask.js";
import { registerUser } from "./registerUser.js";

// Check if user is logged in
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

// If no token, redirect to login
if (!token) {
  window.location.href = "login.html";
}

const modalContainer = document.getElementById("modalCreate");
const createButton = document.getElementById("createButton");
const backButton = document.getElementById("backButton");
const doneButton = document.querySelectorAll(".doneButton");
const newTask = document.getElementById("modalNewTask");
const logoutButton = document.getElementById("logoutButton");
const usernameDisplay = document.getElementById("username-display");

// Display username if available
if (user && user.username) {
  usernameDisplay.textContent = `Hello, ${user.username}!`;
}

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
    const checkbox = document.createElement("input");

    // Set up checkbox
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskCompletion(task._id, checkbox.checked));

    div.textContent = task.title;
    div.className = "taskContent";
    div.id = task._id;

    if (task.completed) {
      div.style.textDecoration = "line-through";
      div.style.color = "gray";
    }

    x.textContent = "delete";
    x.className = "material-icons pointer deleteButton";

    li.appendChild(checkbox);
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

// Add this new function to toggle task completion status
async function toggleTaskCompletion(taskId, completed) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ completed })
    });

    if (!response.ok) {
      throw new Error("Failed to update task status");
    }

    const updatedTask = await response.json();
    
    // Update the task in the local tasks array
    const taskIndex = tasks.findIndex(task => task._id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = completed;
    }
    
    // Refresh the display to show updated status
    displayTasks();
    
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Failed to update task status");
  }
}

// Handle logout
logoutButton.addEventListener("click", () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = "login.html";
});

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
