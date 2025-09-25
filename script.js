

// Fetch tasks from the backend API when the page first loads
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

function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message'; 
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv); 
}

// Display error messages to the user



function renderTasks(tasks) {
// Renders tasks from the API into their respective columns based on status

  const todoColumn = document.querySelector('[data-status="todo"]');
  const doingColumn = document.querySelector('[data-status="doing"]');
  const doneColumn = document.querySelector('[data-status="done"]');

todoColumn.innerHTML = " ";
doingColumn.innerHTML = " ";
doneColumn.innerHTML = " ";


  tasks.forEach(task => {
    
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.textContent = task.title;
    taskCard.addEventListener('click', () => openTaskModal(task));

    if (task.status === 'todo') {
      todoColumn.appendChild(taskCard);
    } else if (task.status === 'doing') {
      doingColumn.appendChild(taskCard);
    } else if (task.status === 'done') {
      doneColumn.appendChild(taskCard);
    }
  });
  console.log("Rendered tasks", tasks);
}  


function cacheTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
} // Save tasks to localStorage for caching


function loadTasks() {
  const cachedTasks = localStorage.getItem('tasks');

  if (cachedTasks) {
    const tasks = JSON.parse(cachedTasks);
    renderTasks(tasks);
  }
    else {
    fetchTasks();
  }
  }
 // Load tasks from localStorage if available, otherwise fetch from API





/**
 * Opens the modal dialog with pre-filled task details.
 */
function openTaskModal(task) {
 
  const modal = document.getElementById("task-modal");
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-description").value = task.description;
  document.getElementById("task-status").value = task.status;

  modal.showModal();
  

  document.getElementById('save-changes-btn').onclick = () => saveTaskChanges(task.id);
  document.getElementById('delete-task-btn').onclick = () => deleteTask(task.id);
  
}


function saveTaskChanges(taskId) {
  const updatedTitle = document.getElementById('task-title').value;
  const updatedDescription = document.getElementById('task-description').value;
  const updatedStatus = document.getElementById('task-status').value;

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].title = updatedTitle;
    tasks[taskIndex].description = updatedDescription;
    tasks[taskIndex].status = updatedStatus;
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);
  document.getElementById('task-modal').close()
}

function deleteTask(taskId) {
  const confirmDelete = confirm("Are you sure you want to delete this task permanently?");
  if (!confirmDelete) return; // 

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Remove the task by filtering it out
  const updatedTasks = tasks.filter(task => task.id !== taskId);

  // Save the new list to localStorage
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  
  renderTasks(updatedTasks);

  
  document.getElementById('task-modal').close();
}


// Sidebar toggle functionality
 document.getElementById("sidebar-toggle").addEventListener("click", () => {
   const sidebar = document.getElementById("side-bar-div");
   const showIcon = document.getElementById("show-sidebar-icon");
   sidebar.classList.toggle("hidden");
  showIcon.style.display = "block";

document.getElementById("hide-sidebar-icon").addEventListener("click", () => {
  const sidebar = document.getElementById("side-bar-div");
  const hideIcon = document.getElementById("hide-sidebar-icon");
  sidebar.classList.remove("hidden");
  hideIcon.style.display = "block";
});

 })

function themeToggle() {


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
 * Initializes the task board and modal handlers.
 */
function initTaskBoard() {
  loadTasks();
  setupModalCloseHandler();
}

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", initTaskBoard);




