import "./style.scss";
import { Application } from "@splinetool/runtime";
const TASKS_KEY = "lalistella.tasks.v1";
const THEME_KEY = "lalistella.theme";
const validThemes = ["light", "pink", "blue", "green", "dark"];

const form = document.querySelector(".list-form");
const input = document.getElementById("input-field");
const list = document.getElementById("shopping-list");
const count = document.getElementById("task-count");
const feedback = document.getElementById("feedback");
const clearCompletedButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll("[data-filter]");
const colorThemes = document.querySelectorAll('[name="theme"]');

let activeFilter = "all";
let tasks = loadTasks();

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    if (!Array.isArray(savedTasks)) return [];

    return savedTasks.filter((task) => (
      task && typeof task.id === "string" && typeof task.text === "string"
    )).map((task) => ({
      id: task.id,
      text: task.text,
      completed: Boolean(task.completed),
    }));
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    feedback.textContent = "Le modifiche sono salvate su questo dispositivo.";
  } catch {
    feedback.textContent = "Impossibile salvare: lo spazio locale del browser non è disponibile.";
  }
}

function renderTasks() {
  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === "active") return !task.completed;
    if (activeFilter === "completed") return task.completed;
    return true;
  });
  const remaining = tasks.filter((task) => !task.completed).length;

  count.textContent = remaining === 1
    ? "1 cosa da fare"
    : `${remaining} cose da fare`;
  clearCompletedButton.disabled = !tasks.some((task) => task.completed);
  list.replaceChildren();

  if (visibleTasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = tasks.length === 0
      ? "La lista è vuota: aggiungi la prima cosa da fare ✨"
      : activeFilter === "active"
        ? "Hai completato tutto. Ben fatto! 🎉"
        : "Non ci sono attività completate.";
    list.append(emptyState);
    return;
  }

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task";
    if (task.completed) item.classList.add("is-completed");

    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Segna come ${task.completed ? "da fare" : "completata"}: ${task.text}`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    label.append(checkbox, text);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Elimina: ${task.text}`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(label, deleteButton);
    list.append(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  tasks.unshift({
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    text,
    completed: false,
  });
  input.value = "";
  activeFilter = "all";
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  saveTasks();
  renderTasks();
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTasks();
  });
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

function applyTheme(theme) {
  document.documentElement.className = theme;
  colorThemes.forEach((option) => {
    option.checked = option.id === theme;
  });
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem(THEME_KEY);
} catch {
  // Keep the default theme if browser storage is unavailable.
}
applyTheme(validThemes.includes(savedTheme) ? savedTheme : "light");

colorThemes.forEach((option) => {
  option.addEventListener("change", () => {
    applyTheme(option.id);
    try {
      localStorage.setItem(THEME_KEY, option.id);
    } catch {
      // The selected theme still applies for this visit if storage is unavailable.
    }
  });
});

window.addEventListener("storage", (event) => {
  if (event.key === TASKS_KEY) {
    tasks = loadTasks();
    renderTasks();
  }
  if (event.key === THEME_KEY && validThemes.includes(event.newValue)) {
    applyTheme(event.newValue);
  }
});

renderTasks();

const canvas = document.getElementById("canvas3d");
const splineScene = canvas.closest(".spline-scene");

try {
  const appp = new Application(canvas);
  appp.load("https://prod.spline.design/lhPF2Aa9FVeoLRe4/scene.splinecode")
    .catch(() => splineScene.classList.add("is-unavailable"));
} catch {
  splineScene.classList.add("is-unavailable");
}
