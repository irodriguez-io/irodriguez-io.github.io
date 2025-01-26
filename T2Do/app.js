// Get data from form elements
  //const dueDate = document.querySelector('#dueDate');
const newTask = document.querySelector('#newTask');
const addButton = document.querySelector('#addButton');
const Lang = document.documentElement.lang;

// This is the list of tasks
let taskList = [];

// This is the object that represents each individual task
const Task = {
  task: '',
  //dueOn: '',
  status: '',
  //strDate: '',
};

// Save task list to local storage
function saveToLocalStorage() {
  localStorage.setItem('taskList', JSON.stringify(taskList));
}

// Retrieve task list from local storage
function retrieveFromLocalStorage() {
  const storedTaskList = localStorage.getItem('taskList');
  if (storedTaskList) {
    taskList = JSON.parse(storedTaskList);
  }
}

// OnClick event for the Add button
addButton.addEventListener('click', (event)=>{
  event.preventDefault(); // Prevents page reload
  
  // Run validation before adding a new task
   if (validateForm()) {
    //console.log("its working");
    addNewTask();
    // Add the new task if validation passes
  }
} 
);

// Document loaded event to set date restriction, load saved data, check filters, and draw the table if needed. 
// it will also do some styling on the document
document.addEventListener('DOMContentLoaded', ()=>{
  // Makes sure the table with task doesn't expand beyond the form 
  const section = document.querySelector('section.glass');
  const form = document.getElementById('formI');

  function adjustSectionHeight() {
    const formTop = form.getBoundingClientRect().top;
    const sectionTop = section.getBoundingClientRect().top;

    const maxHeight = formTop - sectionTop - 30;
    // 30px gap for some padding
    if (maxHeight > 0) {
      section.style.maxHeight = `${maxHeight}px`;
    }
  }
  adjustSectionHeight();
  // Adjust on load
  window.addEventListener('resize', adjustSectionHeight);
  // Adjust on resize

  // Set min date to today, so you can't set a task to be due in the past
  //dueDate.min = new Date().toISOString().split("T")[0];

  // Retrieve task list from local storage
  retrieveFromLocalStorage();

  // Loads saved tasks
  drawTable(taskList);
}
);

// Change event listeners for the filter radio buttons
const filterRadios = document.querySelectorAll('.filters input[type="radio"]');
filterRadios.forEach(radio=>{
  radio.addEventListener('change', ()=>drawTable(taskList));
}
);

// Date format function
/* function formatDate(dateString) {
  const [year,month,day] = dateString.split('-').map(Number);
  const date = new Date(year,month - 1,day);
  const options = {
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
} */

// Input fields validation function
function validateForm() {
  //const dueDateValue = dueDate.value.trim();
  const newTaskValue = newTask.value.trim();

  // Check if the due date is empty
  /* if (!dueDateValue) {
    alert("Please select a due date.");
    return false;
    // Prevent the form submission
  } */

  // Check if the new task field is empty
  if (!newTaskValue) {
    alert("Please enter a task.");
    return false;
    // Prevent the form submission
  }

  return true;
  // Allow the form submission if both fields are filled
}

// Add new task function
function addNewTask() {

  // Creates the individual task with the information collected from the form elements
  const taskObject = Object.create(Task);
  taskObject.task = newTask.value.trim();
  //taskObject.dueOn = dueDate.value;
  taskObject.status = 'pending';
  //taskObject.strDate = formatDate(dueDate.value)

  // Add individual task to the list
  taskList.push(taskObject);

  // Save task list to local storage
  saveToLocalStorage();

  // Clear the input elements
  //dueDate.value = '';
  newTask.value = '';

  // Draw the table with the updated task list
  drawTable(taskList);
}

// Delete a task
function deleteTask(index) {
  // Remove task from taskList
  taskList.splice(index, 1);

  // Save task list to local storage
  saveToLocalStorage();

  // Redraw the table with the updated task list
  drawTable(taskList);
}

// Change the task status
function changeStatus(index) {
  const task = taskList[index];
  task.status = task.status === 'pending' ? 'completed' : 'pending';

  // Save task list to local storage
  saveToLocalStorage();

  // Redraw the table to reflect the updated status
  drawTable(taskList);
}

// Check if a task is due within a certain number of days
/* function isTaskDueWithinDays(taskDate, days) {
  const currentDate = new Date();
  const dueDate = new Date(taskDate);
  const timeDiff = dueDate - currentDate;
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  return daysDiff <= days;
} */

// Draw the task table
function drawTable(tasks) {
  const taskTable = document.getElementById('taskTable');
  
  taskTable.innerHTML = ''; // Clear the existing table rows

  // Determine which status filter is selected
  const selectedStatusFilter = document.querySelector('.filters input[name="taskStatus"]:checked').value;

  // Determine which due date filter is selected
  //const selectedDueDateFilter = document.querySelector('.filters input[name="taskDueDate"]:checked').value;

  // Filter tasks based on the selected status filter
  let filteredTasks = tasks;
  if (selectedStatusFilter === 'pending') {
    filteredTasks = filteredTasks.filter(task=>task.status === 'pending');
  } else if (selectedStatusFilter === 'completed') {
    filteredTasks = filteredTasks.filter(task=>task.status === 'completed');
  }

  // Further filter tasks based on the selected due date filter
  /* if (selectedDueDateFilter === 'thisWeek') {
    filteredTasks = filteredTasks.filter(task=>isTaskDueWithinDays(task.dueOn, 7));
  } else if (selectedDueDateFilter === 'nextMonth') {
    filteredTasks = filteredTasks.filter(task=>isTaskDueWithinDays(task.dueOn, 30));
  } */

  filteredTasks.forEach((task,index)=>{
    // Create table row
    const tr = document.createElement('tr');

    // Create checkbox cell
    const tdCheckbox = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.role = 'switch';
    checkbox.className = 'checkbox';
    checkbox.checked = task.status === 'completed';
    checkbox.addEventListener('click', ()=>changeStatus(index));
    tdCheckbox.appendChild(checkbox);
    tr.appendChild(tdCheckbox);

    //changes text based on document language
    DueText = '';
    if (Lang === 'en-US') {
      dueText = 'due on'
    } else {
      dueText = 'antes de'
    }
    
    // Create task text cell
    const tdTaskText = document.createElement('td');
    const pTaskText = document.createElement('p');
    pTaskText.className = 'taskText';
    pTaskText.textContent = `${task.task}`;
    // pTaskText.textContent = `${task.task}, ${dueText}: ${task.strDate}`; // Backup line

    // Set initial style based on task status
    if (task.status === 'completed') {
      pTaskText.style.textDecoration = 'line-through';
      pTaskText.style.color = 'gray';
    } else {
      pTaskText.style.textDecoration = 'none';
      pTaskText.style.color = 'blue';
    }

    // Append the task text element
    tr.appendChild(tdTaskText).appendChild(pTaskText);

    // Create delete button cell
    const tdDeleteButton = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = 'x';
    deleteButton.addEventListener('click', ()=>deleteTask(index));
    tdDeleteButton.appendChild(deleteButton);
    tr.appendChild(tdDeleteButton);

    // Append the row to the table body
    taskTable.appendChild(tr);
  }
  );
}
