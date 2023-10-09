import "./style.scss";

// t h e m e
const colorThemes = document.querySelectorAll('[name="theme"]');

// store theme
const storeTheme = function (theme) {
  localStorage.setItem("theme", theme);
};

// set theme when visitor returns
const setTheme = function () {
  const activeTheme = localStorage.getItem("theme");
  colorThemes.forEach((themeOption) => {
    if (themeOption.id === activeTheme) {
      themeOption.checked = true;
    }
  });
  // fallback for no :has() support
  document.documentElement.className = activeTheme;
};

colorThemes.forEach((themeOption) => {
  themeOption.addEventListener("click", () => {
    storeTheme(themeOption.id);
    // fallback for no :has() support
    document.documentElement.className = themeOption.id;
  });
});

document.onload = setTheme();

// f i r e b a s e
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://lecosedacomprare-511f2-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Your web app's Firebase configuration
/* const firebaseConfig = {
  apiKey: "AIzaSyDQ7bZmt5Z6mururrMcwuUR2Eby8cQ06lY",
  authDomain: "lecosedacomprare-511f2.firebaseapp.com",
  databaseURL:
    "https://lecosedacomprare-511f2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lecosedacomprare-511f2",
  storageBucket: "lecosedacomprare-511f2.appspot.com",
  messagingSenderId: "43074085832",
  appId: "1:43074085832:web:617b613c6bf4f28ed356fd",
};
 */
// Initialize Firebase
/* const app = initializeApp(firebaseConfig);

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonFieldEl = document.getElementById("add-button");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  console.log(inputValue);
}); */
