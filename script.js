

// Fetch tasks from the backend API when the page loads
function fetchTasks() {
  fetch('https://jsl-kanban-api.vercel.app/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return response.json();
    })
    .then(tasks => {
      renderTasks(tasks); // Function to display tasks in the UI
    })
    .catch(error => {
      showErrorMessage("Unable to load tasks. Please try again.");
      console.error(error);
    });
}; // If there is an error fetching tasks, show an error message

function renderTasks(tasks) {

  const todoColumn = document.querySelector('[data-status="todo"]');
  const doingColumn = document.querySelector('[data-status="doing"]');
  const doneColumn = document.querySelector('[data-status="done"]');

  tasks.forEach(task => {
    
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.textContent = task.title;

   
    if (task.status === 'todo') {
      todoColumn.appendChild(taskCard);
    } else if (task.status === 'doing') {
      doingColumn.appendChild(taskCard);
    } else if (task.status === 'done') {
      doneColumn.appendChild(taskCard);
    }
  });
} // Renders tasks from the API into their respective columns based on status




/**
 * Opens the modal dialog with pre-filled task details.
 * @param {Object} task - The task object to display in the modal.
 */
function openTaskModal(task) {
  const modal = document.getElementById("task-modal");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const statusSelect = document.getElementById("task-status");

  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;

  modal.showModal();
}
const newModal = document.getElementById("new-task-modal");
const addNewTask = document.getElementById("add-new-task")
addNewTask.addEventListener("click", openNewTaskModal);



function openNewTaskModal() {
  const newModal = document.getElementById("new-task-modal");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const statusSelect = document.getElementById("task-status");

  titleInput.value = "task.title";
  descInput.value = "task.description";
  statusSelect.value = "task.status";
}



/**
 * Sets up modal close behavior.
 */
function setupModalCloseHandler() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-btn");

  closeBtn.addEventListener("click", () => {
    modal.close();
  });
}


/**
 * Creates a dark mode event triggered when the toggle is clicked
 * 
 * */
// Dark mode toggle
const darkModeToggle = document.getElementById("theme-toggle-button");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const logo= document.getElementById("logo");
  if (document.body.classList.contains("dark-mode")) {
    logo.src = "./assets/logo-dark.svg";
  }
  else {
    logo.src = "./assets/logo-light.svg";
  }
});  // swap logo image based on mode


/**
 * Initializes the task board and modal handlers.
 */
function initTaskBoard() {
  fetchTasks();
  renderTasks();
  setupModalCloseHandler();
}

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", initTaskBoard);




