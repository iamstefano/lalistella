import "./style.scss";
import { Application } from "@splinetool/runtime";

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

//animation

const canvas = document.getElementById("canvas3d");
const appp = new Application(canvas);
appp.load("https://prod.spline.design/lhPF2Aa9FVeoLRe4/scene.splinecode");

// f i r e b a s e
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
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

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(shoppingListInDB, inputValue);

  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  // Challenge: Change the onValue code so that it uses snapshot.exists() to show items when there are items in the database and if there are not displays the text 'No items here... yet'.

  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "Non hai ancora aggiunto nulla!🤦🏻‍♂️ ";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
