import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// DOM Selectors
const listItem = document.getElementById("user-input");
const addButton = document.getElementById("add-item");
const displayList = document.getElementById("list-items");

// Firebase Variables
const appSettings = {
  databaseURL: "https://shopping-db-98cec-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const currentItem = ref(database, "list entry");

// Main function
addButton.addEventListener("click", (e) => {
  let item = listItem.value;

  if (item == "") {
    e.preventDefault();
  } else {
    push(currentItem, item);
    listItem.value = "";
    // displayList.innerHTML += `<li class="list-item">${item}</li>`;
  }
});

/* Function that connects to Firebase to ensure that the database exists and entries update in real time */
onValue(currentItem, function (snapshot) {
  if (snapshot.exists()) {
    let liveDatabase = Object.entries(snapshot.val());
    resetList();

    console.log(liveDatabase);

    for (let i = 0; i < liveDatabase.length; i++) {
      let currentValue = liveDatabase[i];
      let currentValueKey = liveDatabase[0];
      let currentValueValue = liveDatabase[1];

      addAnotherListItem(currentValue);
    }
  } else {
    displayList.innerHTML = "There are no items in your list yet";
  }
});

// Reset unordered list content to blank
const resetList = () => {
  displayList.innerHTML = "";
};

// Function to append or remove additional items to the DOM & database
const addAnotherListItem = (item) => {
  let itemKey = item[0];
  let itemValue = item[1];

  let listElement = document.createElement("li");

  listElement.innerHTML = itemValue;

  displayList.append(listElement);

  // Removal

  listElement.addEventListener("click", () => {
    let preciseLocation = ref(database, `list entry/${itemKey}`);
    remove(preciseLocation);
  });
};
