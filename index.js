// TASK: import helper functions from utils - FIXED
import { getTasks, createNewTask, patchTask, putTask, deleteTask } from './utils/taskFunctions.js';
// TASK: import initialData - FIXED
import { initialData } from './initialData.js';

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  console.log("Initialise data call")
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true');
  } else {
    refreshTasksUI(); 
    console.log('Data already exists in localStorage');
  }
}

// TASK: Get elements from the DOM - FIXED
const elements = {

  // Nav Els
  logo: document.getElementById('logo'),
  themeSwitch: document.getElementById('switch'),
  sideBar: document.getElementById('side-bar-div'),
  hideSideBarBtn: document.getElementById('hide-side-bar-btn'),
  showSideBarBtn: document.getElementById('show-side-bar-btn'),
  boardsNavLinksDiv: document.getElementById('boards-nav-links-div'),

  // Header Els
  header: document.getElementById('header'),
  dropdownBtn: document.getElementById('dropdownBtn'),
  editBoardBtn: document.getElementById('edit-board-btn'),
  headerBoardName: document.getElementById('header-board-name'),
  addNewTaskBtn: document.getElementById('add-new-task-btn'),

  // Task Columns Els
  columnDivs: Array.from(document.getElementsByClassName('column-div')),
  todoColumn: document.querySelector('[data-status="todo"] .tasks-container'),
  doingColumn: document.querySelector('[data-status="doing"] .tasks-container'),
  doneColumn: document.querySelector('[data-status="done"] .tasks-container'),

  // Modal Els
  createTaskBtn: document.getElementById('create-task-btn'),
  newTaskModal: document.getElementById('new-task-modal-window'),
  cancelAddTaskBtn: document.getElementById('cancel-add-task-btn'),
  titleInput: document.getElementById('title-input'),
  descInput: document.getElementById('desc-input'),
  selectStatus: document.getElementById('select-status'),

  // Edit Task Modal Els
  editTaskModal: document.querySelector('.edit-task-modal-window'),
  editTaskForm: document.getElementById('edit-task-form'),
  editTaskTitleInput: document.getElementById('edit-task-title-input'),
  editTaskDescriptionInput: document.getElementById('edit-task-desc-input'),
  editTaskStatusInput: document.getElementById('edit-select-status'),
  saveTaskChangesBtn: document.getElementById('save-task-changes-btn'),
  cancelEditBtn: document.getElementById('cancel-edit-btn'),
  deleteTaskBtn: document.getElementById('delete-task-btn'),

  // Other Elements
  filterDiv: document.getElementById('filterDiv'),

}

let activeBoard = "";

// Extracts unique board names from tasks
// TASK: FIX BUGS - FIXED
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    activeBoard = localStorageBoard || boards[0]; // fixed code using logical operator "||"
    elements.headerBoardName.textContent = activeBoard
    styleActiveBoard(activeBoard)
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs - FIXED
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => {  // corrected unfinished click EventListener
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard))
      styleActiveBoard(activeBoard)
    });
    boardsContainer.appendChild(boardElement);
  });
  initializeData();
}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs - FIXED
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName); // replaced "=" with "==="

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener("click", () => {  //  corrected unfinished click EventListener
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}


function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs - FIXED
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach(btn => { // fixed incorrect method name from "foreach" to "forEach"
    
    if (btn.textContent === boardName) {
      btn.classList.add('active'); 
    } else {
      btn.classList.remove('active'); 
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector(`.column-div[data-status=${task.status}]`);
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  // lines 172 - 196 has been FIXED
  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  
  // Create a title element
  const titleElement = document.createElement('h4');
  titleElement.textContent = task.title;
  taskElement.appendChild(titleElement);
  
  // Create a description element
  const descElement = document.createElement('p');
  descElement.textContent = task.description;
  taskElement.appendChild(descElement);
  
  // removed the following lines:
  // const statusElement = document.createElement('span');
  // statusElement.textContent = `Status: ${task.status}`;
  // taskElement.appendChild(statusElement);
  
  // Set data attribute for task ID
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(taskElement);
  
}

function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener("click", () => toggleModal(false, elements.editTaskModal)); // corrected unfinished click EventListener

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  // FIXED event listeners for show and hide sidebar buttons
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false));
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true));


  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  // FIXED - changed "createNewTaskBtn" to "createTaskBtn"
  elements.createTaskBtn.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log("Create task button was clicked");
    addTask(event);
    toggleModal(false);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.newTaskModal.addEventListener('submit', (event) => {
    addTask(event)
  });
}

// Toggles tasks modal
// Task: Fix bugs - FIXED
// Fix toggleModal function by correcting ternary syntax for modal display
function toggleModal(show, modal = elements.newTaskModal) {
  modal.style.display = show ? 'block' : 'none';
  if (show) {
    elements.titleInput.value = '';
    elements.descInput.value = '';
    elements.selectStatus.value = 'todo';
  }
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

// Function to handle adding a new task
function addTask(event) {
  event.preventDefault(); 

  // Assign user input to the task object
  const task = {
      title: elements.titleInput.value,
      description: elements.descInput.value,
      status: elements.selectStatus.value,
      board: activeBoard
  };
  
  console.log(task);
  const newTask = createNewTask(task);
  console.log(newTask);
  if (newTask) {
      addTaskToUI(newTask); // Assuming addTaskToUI is defined elsewhere
      toggleModal(false, elements.newTaskModal);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      console.log(event);
      // event.target.reset(); // Reset the form inputs
      refreshTasksUI(); // Assuming refreshTasksUI is defined elsewhere
    }
  }

  elements.addNewTaskBtn.addEventListener('click', (event) => {
    toggleModal(true, elements.newTaskModal);
    
  });

  elements.cancelAddTaskBtn.addEventListener('click', (event) => {
    toggleModal(false, elements.newTaskModal);
  });

  elements.createTaskBtn.addEventListener('click', (event) => {
    addTask(event);
    toggleModal(false, elements.newTaskModal);
  });


  // Hide the sidebar by default on page load
  window.onload = function () {
    // Initially hide the sidebar and related buttons
    elements.sideBar.style.display = 'none'; // Sidebar hidden
    elements.hideSideBarBtn.style.display = 'none'; // Hide button hidden
    elements.showSideBarBtn.style.display = 'block'; // Show button visible

  };

  function toggleSidebar(show) {
    // Get the current display state of the sidebar
    const isSidebarDisplayed = elements.sideBar.style.display === 'block' || window.
    getComputedStyle(elements.sideBar).display === 'block';
  
    // If 'show' is true and the sidebar is not already visible, show the sidebar
    if (show && !isSidebarDisplayed) {
      elements.sideBar.style.display = 'block'; // Show the sidebar
      elements.hideSideBarBtn.style.display = 'block'; // Show the hide button
      elements.showSideBarBtn.style.display = 'none'; // Hide the show button
    } 
    // If 'show' is false and the sidebar is currently visible, hide the sidebar
    else if (!show && isSidebarDisplayed) {
      elements.sideBar.style.display = 'none'; // Hide the sidebar
      elements.hideSideBarBtn.style.display = 'none'; // Hide the hide button
      elements.showSideBarBtn.style.display = 'block'; // Show the show button
    }
  }
  
function toggleTheme() {
    if (elements.themeSwitch.checked) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
     else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme'); 
    }
}

// Add event listener for the theme switch
elements.themeSwitch.addEventListener('change', toggleTheme);

function openEditTaskModal(task) {
  // Set task details in modal inputs
  elements.editTaskTitleInput.value = task.title;
  elements.editTaskDescriptionInput.value = task.description;
  elements.editTaskStatusInput.value = task.status;

  // Get button elements from the task modal
  elements.saveTaskChangesBtn = document.getElementById('save-task-changes-btn');

  // Call saveTaskChanges upon click of Save Changes button
  elements.saveTaskChangesBtn.onclick = () => {
    saveTaskChanges(task.id); // Pass the task ID to saveTaskChanges
  };

  // Delete task using a helper function and close the task modal
  elements.deleteTaskBtn.onclick = () => {
    deleteTask(task.id);
    refreshTasksUI();
    toggleModal(false, elements.editTaskModal);
  };

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs from the modal
  const updatedTitle = elements.editTaskTitleInput.value;
  const updatedDescription = elements.editTaskDescriptionInput.value;
  const updatedStatus = elements.editTaskStatusInput.value;

  // Create an object with the updated task details
  const updates = {
    title: updatedTitle,
    description: updatedDescription,
    status: updatedStatus,
  };

  // Update task using the patchTask helper function
  patchTask(taskId, updates); // Call the helper function to update the task

  // Close the modal
  toggleModal(false, elements.editTaskModal); 

  // Refresh the UI to reflect the changes
  refreshTasksUI(); // Refresh the tasks in the UI
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}