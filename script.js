let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingId = null;

// Get all the elements from HTML
const openModalBtn = document.getElementById('openModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const taskColumn = document.getElementById('taskColumn');
const modalTitle = document.getElementById('modalTitle');

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Generate unique id for each task
function generateId() {
  return Date.now().toString();
}

// Open modal
function openModal() {
  editingId = null;
  modalTitle.textContent = 'Add New Task';
  taskTitle.value = '';
  taskDesc.value = '';
  taskColumn.value = 'todo';
  modalOverlay.classList.add('active');
  taskTitle.focus();
}

// Close modal
function closeModal() {
  modalOverlay.classList.remove('active');
  editingId = null;
}

// Render all tasks on the board
function renderTasks() {
  // Clear all columns first
  document.getElementById('cards-todo').innerHTML = '';
  document.getElementById('cards-progress').innerHTML = '';
  document.getElementById('cards-done').innerHTML = '';

  // Loop through tasks and create cards
  tasks.forEach(function(task) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.id = 'card-' + task.id;

    card.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.desc}</p>
      <div class="card-buttons">
        <button class="edit-btn" onclick="editTask('${task.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
      </div>
    `;

    // Drag events
    card.addEventListener('dragstart', function(e) {
        card.classList.add('dragging');
        card.setAttribute('data-id', task.id);
        e.dataTransfer.setData('text/plain', task.id);
    });

    card.addEventListener('dragend', function() {
      card.classList.remove('dragging');
    });

    // Add card to correct column
    document.getElementById('cards-' + task.column).appendChild(card);
  });
}

// Save task (add or edit)
function saveTask() {
  const title = taskTitle.value.trim();
  if (title === '') {
    alert('Please enter a task title!');
    return;
  }

  if (editingId) {
    // Edit existing task
    tasks = tasks.map(function(task) {
      if (task.id === editingId) {
        return {
          id: task.id,
          title: title,
          desc: taskDesc.value.trim(),
          column: taskColumn.value
        };
      }
      return task;
    });
  } else {
    // Add new task
    const newTask = {
      id: generateId(),
      title: title,
      desc: taskDesc.value.trim(),
      column: taskColumn.value
    };
    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  closeModal();
}

// Edit a task
function editTask(id) {
  const task = tasks.find(function(t) {
    return t.id === id;
  });

  if (task) {
    editingId = id;
    modalTitle.textContent = 'Edit Task';
    taskTitle.value = task.title;
    taskDesc.value = task.desc;
    taskColumn.value = task.column;
    modalOverlay.classList.add('active');
  }
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

// Drag and drop
const columns = document.querySelectorAll('.cards-container');

columns.forEach(function(column) {
  column.addEventListener('dragover', function(e) {
    e.preventDefault();
    column.style.backgroundColor = '#e8f0ff';
  });

  column.addEventListener('dragleave', function() {
    column.style.backgroundColor = '';
  });

  column.addEventListener('drop', function(e) {
  e.preventDefault();
  column.style.backgroundColor = '';

  const id = e.dataTransfer.getData('text/plain');
  const newColumn = column.id.replace('cards-', '');

  tasks = tasks.map(function(task) {
    if (task.id === id) {
      return { ...task, column: newColumn };
    }
    return task;
  });

  saveTasks();
  renderTasks();
  });
});

// Button event listeners

// Button event listeners
openModalBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
saveBtn.addEventListener('click', saveTask);

// Close modal when clicking outside
modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// First render when page loads
renderTasks();

const darkModeBtn = document.getElementById('darkModeBtn');

// Check saved theme when page loads
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  darkModeBtn.textContent = '☀️ Light';
}

darkModeBtn.addEventListener('click', function() {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    darkModeBtn.textContent = '☀️ Light';
    localStorage.setItem('theme', 'dark');
  } else {
    darkModeBtn.textContent = '🌙 Dark';
    localStorage.setItem('theme', 'light');
  }
});