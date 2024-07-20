const mainContainer = document.querySelector("#main");
const addCardButton = document.querySelector("#addCard");

let draggedElement = null;

const addTask = (event) => {
  event.preventDefault();

  const currentForm = event.target;
  const taskValue = currentForm.elements[0].value;
  const columnDiv = currentForm.parentElement;
  const newTicket = createTicket(taskValue);

  if (!taskValue) return;

  columnDiv.insertBefore(newTicket, currentForm);

  const columnTitle = columnDiv.children[0].innerText;

  if (!Array.isArray(savedTasks[columnTitle])) {
    savedTasks[columnTitle] = [];
  }

  savedTasks[columnTitle].push(taskValue);

  localStorage.setItem("savedTasks", JSON.stringify(savedTasks));

  currentForm.reset();
};

const createCard = (cardTitle) => {
  const cardDiv = document.createElement("div");
  const titleHeading = document.createElement("h3");
  const taskForm = document.createElement("form");
  const taskInput = document.createElement("input");

  const headingText = document.createTextNode(cardTitle);

  cardDiv.setAttribute("class", "column");
  taskInput.setAttribute("type", "text");
  taskInput.setAttribute("placeholder", "Add task");

  titleHeading.appendChild(headingText);
  taskForm.appendChild(taskInput);
  cardDiv.appendChild(titleHeading);
  cardDiv.appendChild(taskForm);

  taskForm.addEventListener("submit", addTask);

  cardDiv.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  cardDiv.addEventListener("drop", (event) => {
    event.preventDefault();
    const targetElement = event.target;

    if (targetElement.tagName === "INPUT" || targetElement.classList.contains("column")) {
      const columnDiv = targetElement.tagName === "INPUT" ? targetElement.parentElement : targetElement;
      columnDiv.insertBefore(draggedElement, targetElement);
    }
  });

  return cardDiv;
};

const createTicket = (taskValue) => {
  const ticketParagraph = document.createElement("p");
  const ticketText = document.createTextNode(taskValue);

  ticketParagraph.setAttribute("draggable", "true");
  ticketParagraph.setAttribute("class", "ticket");
  ticketParagraph.appendChild(ticketText);

  ticketParagraph.addEventListener("dragstart", (event) => {
    draggedElement = event.target;
  });

  return ticketParagraph;
};

let savedTasks = JSON.parse(localStorage.getItem("savedTasks"));

if (!savedTasks) {
  savedTasks = {};
}

// Displaying the tasks already saved in localStorage
for (const title in savedTasks) {
  const card = createCard(title);

  const tasksArray = savedTasks[title];

  tasksArray.forEach((task) => {
    const taskElement = createTicket(task);
    card.insertBefore(taskElement, card.lastElementChild);
  });

  mainContainer.insertBefore(card, addCardButton);
}

addCardButton.addEventListener("click", () => {
  const newCardTitle = prompt("Enter card name:");

  if (!newCardTitle) return;

  const newCardDiv = createCard(newCardTitle);
  mainContainer.insertBefore(newCardDiv, addCardButton);
});
