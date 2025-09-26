// saved theme is loaded from local storage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

/**
 * Function used to fetch tasks from the API when the webpage is first opened.
 * If there is an error then a message is displayed to the user.  
 * @returns response.json()
 */

function fetchTasks() {
  document.getElementById('loading-message').style.display = 'block';
  fetch('https://jsl-kanban-api.vercel.app/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return response.json();
    })
    .then(tasks => {
  cacheTasks(tasks);
  renderTasks(tasks);
 document.getElementById('loading-message').style.display = 'none';
})
    .catch(error => {
      showErrorMessage("Unable to load tasks. Please try again.");
      document.getElementById('loading-message').style.display = 'none';
    });
}; // If there is an error fetching tasks, show an error message


/**
 * Function used to show error message upon failure of fetching tasks from API. 
 */
function showErrorMessage(message) {
  document.querySelectorAll('error-message').forEach(el => el.remove());
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message'; 
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv); 
} // Display error messages to the user


/**
 * /Function that renders tasks from the API into their respective columns based on status along with all their details
 * @param {*} tasks 
 */
function renderTasks(tasks) {

  const todoColumn = document.querySelector('[data-status="todo"]');
  const doingColumn = document.querySelector('[data-status="doing"]');
  const doneColumn = document.querySelector('[data-status="done"]');

todoColumn.innerHTML = "";
doingColumn.innerHTML = "";
doneColumn.innerHTML = ""; // Clears any existing tasks to avoid duplicates.


  tasks.forEach(task => {
    
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.textContent = task.title;
    taskCard.addEventListener('click', () => openTaskModal(task)); // task card is created for every task so the title is displayed

    if (task.status === 'todo') {
      todoColumn.appendChild(taskCard);
    } else if (task.status === 'doing') {
      doingColumn.appendChild(taskCard);
    } else if (task.status === 'done') {
      doneColumn.appendChild(taskCard);
    } // Each task is appended to a column depending on its status.
  });
}  


/**
 * Function that saves tasks to localStorage for caching. 
 * @param {*} tasks 
 */
function cacheTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
} // tasks can later be retrieved from localStorage


/**
 * Function to load tasks from localStorage whenever possible, otherwise fetch tasks from API.
 */
function loadTasks() {
  const cachedTasks = localStorage.getItem('tasks');

  if (cachedTasks) {
    const tasks = JSON.parse(cachedTasks);
    renderTasks(tasks);
  }
    else {
    fetchTasks();
  } // tasks that were saved to localStorage are called back if applicable.
  }
 


/**
 * Opens the modal dialog with pre-filled task details from the API or localStorage.
 */
function openTaskModal(task) {
 
  const modal = document.getElementById("task-modal");
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-description").value = task.description;
  document.getElementById("task-status").value = task.status; // task details appear in the modal


  modal.showModal();
  

  document.getElementById('save-changes-btn').onclick = () => saveTaskChanges(task.id);
  document.getElementById('delete-task-btn').onclick = () => deleteTask(task.id);
  
}


/**
 * Function used to save changes made to the modal to local storage so that changes persist after page load.
 * @param  {*} taskId 
 */
function saveTaskChanges(taskId) {
  const updatedTitle = document.getElementById('task-title').value;
  const updatedDescription = document.getElementById('task-description').value;
  const updatedStatus = document.getElementById('task-status').value; 

  let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // new array for updated task objects after editing.

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].title = updatedTitle;
    tasks[taskIndex].description = updatedDescription;
    tasks[taskIndex].status = updatedStatus; // if the task index is found, the task is updated with the new details and it is saved to localStorage.
  }

  localStorage.setItem('tasks', JSON.stringify(tasks)); // save to localStorage.
  renderTasks(tasks);
  document.getElementById('task-modal').close()
}

/**
 * Function that deletes tasks from the modal when prompted and confirmed by user. User get a confirmation message. 
 * @param {*} taskId 
 * @returns 
 */
function deleteTask(taskId) {
  const confirmDelete = confirm("Are you sure you want to delete this task permanently?");
  if (!confirmDelete) return; // confirmation message for the user.

  let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // new array for updated task objects after deletion.

  // Removes the task by filtering it out 
  const updatedTasks = tasks.filter(task => task.id !== taskId);

  // Saves the new list to localStorage
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  
  renderTasks(updatedTasks);

  
  document.getElementById('task-modal').close();
}


// Sidebar toggle functionality
const sidebar = document.getElementById("side-bar-div");
const hideSidebar = document.getElementById("sidebar-toggle");
const showSidebarIcon = document.getElementById("show-sidebar-icon");

if (sidebar && hideSidebar && showSidebarIcon) {
  hideSidebar.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    hideSidebar.classList.add("hidden");
    showSidebarIcon.classList.remove("hidden"); // when button is clicked, sidebar is hidden and show-icon is visible
  });

  showSidebarIcon.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    hideSidebar.classList.remove("hidden");
    showSidebarIcon.classList.add("hidden"); // when button is clicked, sidebar is shown and show-icon is hidden.
  });
}
 

// Dark Mode Toggle
const darkModeToggles = [
document.getElementById("theme-toggle-button"),
document.getElementById("mobile-theme-toggle-button"), // two toggle buttons for desktop and mobile.
];

/**
 * Toggles dark mode and updates logo and local storage.
 */

 function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const logo = document.getElementById("logo");
  if (document.body.classList.contains("dark-mode")) {
    logo.src = "./assets/logo-dark.svg";
    localStorage.setItem("theme", "dark");
  } else {
    logo.src = "./assets/logo-light.svg";
    localStorage.setItem("theme", "light"); // logo is changed depending on the theme.
} 
 } // Toggles dark mode class on body so that whole webpage changes on dark mode. 


darkModeToggles
.filter(Boolean)
.forEach(button => {
  button.addEventListener("click", toggleDarkMode);
}); // Event listeners for both buttons so that user can toggle light and dark mod




// Add toggle to logo so it acts as button to show/hide mobile menu
const mobileLogo = document.querySelector(".logo-mobile")
const mobileMenu = document.getElementById("mobile-menu-div")
const mobileOverlay = document.getElementById("overlay")
const mobileMenuCloseButton = document.getElementById("mobile-close-btn")

mobileLogo.addEventListener("click", () => {
  mobileOverlay.classList.remove("hidden");
  mobileMenu.classList.remove("hidden")
}); // the overlay and mobile menu are visible when the logo is clicked.

mobileMenuCloseButton.addEventListener("click", () => {
  mobileOverlay.classList.add("hidden");
  mobileMenu.classList.add("hidden")
}); // the close button closes the mobile menu so the overlay and menu are hidden.



/**
 * Sets up modal close behavior.
 */
function setupModalCloseHandler() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-btn"); 

  closeBtn.addEventListener("click", () => {
    modal.close(); // when the close button of the modal is clicked, the modal closes.
  });
}



/**
 * Initializes the task board and modal handlers.
 */
function initTaskBoard() {
  loadTasks();
  setupModalCloseHandler();
}

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", initTaskBoard);




