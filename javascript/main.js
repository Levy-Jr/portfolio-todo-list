const toggleMode = document.querySelector('[data-toggle-mode]')
const form = document.querySelector('[data-form]')
const todoInput = document.querySelector('[data-todo-input]')
const ul = document.querySelector('[data-ul-list]')
const todoText = document.querySelector('[data-todo-text]')
const leftItems = document.querySelector('[data-items-left]')

/* buttons */
const dataFormButton = document.querySelector('[data-form-button]')
const buttonClearCompleted = document.querySelector('[data-button-clear-completed]')
const buttonAll = document.querySelector('[data-button-all]')
const buttonActive = document.querySelector('[data-button-active]')
const buttonCompleted = document.querySelector('[data-button-completed]')
const todoCheck = document.querySelector('[data-todo-check]')

const getLocalStorage = () => JSON.parse(localStorage.getItem('todos')) ?? []
const setLocalStorage = (todo) => localStorage.setItem('todos', JSON.stringify(todo))

const createTodo = (todo) => {
  let todoLayout = ''
  
  if(todo.completed){
  todoLayout += `
  <li class="padding-block-400 completed" id="${todo.id}">
  <div class="s-b">
    <div class="a-center">
      <button class="check-todo background-image" data-todo-check id="${todo.id}"></button>
      <span class="line-through" data-todo-text>${todo.text}</span>
    </div>
    <button class="remove-button" id="${todo.id}" data-remove-button><img data-remove-button id="${todo.id}" src="images/icon-cross.svg" alt=""></button>
  </div>
</li>
  `} else {
    todoLayout += `
    <li class="padding-block-400" id="${todo.id}">
    <div class="s-b">
      <div class="a-center">
        <button class="check-todo" data-todo-check id="${todo.id}"></button>
        <span data-todo-text>${todo.text}</span>
      </div>
      <button class="remove-button" id="${todo.id}" data-remove-button><img data-remove-button id="${todo.id}" src="images/icon-cross.svg" alt=""></button>
    </div>
  </li>
    `
  }
  ul.insertAdjacentHTML('beforeend', todoLayout)
}

const addTodo = (todo) => {
  const readLocalStorage = getLocalStorage()
  readLocalStorage.push(todo)
  setLocalStorage(readLocalStorage)
}

const updateId = () => parseInt(Date.now() * Math.random())

const saveTodo = () => {
  const todo = {
    id: updateId(),
    text: todoInput.value,
    completed: false
  }

  addTodo(todo)
  createTodo(todo)
  todoInput.value = ''
}

const completeTodo = (todoId) => {
  const readLocalStorage = getLocalStorage()
  readLocalStorage.map(todo => {
    if(todo.id == todoId){
      todo.completed == false ? todo.completed = true : todo.completed = false
    }
  })

  setLocalStorage(readLocalStorage)
}

const deleteTodo = (todoId) => {
  const readLocalStorage = getLocalStorage()
  const filteredTodos = readLocalStorage.filter(todo => todo.id != todoId)

  setLocalStorage(filteredTodos)
}

const deleteCompletedTodos = () => {
  const readLocalStorage = getLocalStorage()
  const completedTodos = readLocalStorage.filter(todo => todo.completed != true)

  setLocalStorage(completedTodos)
}

buttonClearCompleted.addEventListener('click', () => {
  document.querySelectorAll('.completed').forEach(completed => {
    completed.remove()
  })
  deleteCompletedTodos()
})

/* Retorna apenas a quantidade de itens não completados */
const getLeftItems = () => {
  const readLocalStorage = getLocalStorage()
  const completedTodos = readLocalStorage.filter(todo => todo.completed == false)

  return completedTodos.length
}

leftItems.innerHTML = getLeftItems()

ul.addEventListener('click', (e) => {
  const targetEl = e.target
  const parentEl = targetEl.closest('li')

  if(targetEl.hasAttribute('data-remove-button')){
    parentEl.remove()
    deleteTodo(targetEl.id)
    /* Atualiza a quantidade de itens restantes */
    leftItems.innerHTML = getLeftItems()
  }

  if(targetEl.hasAttribute('data-todo-check')){
    parentEl.querySelector('[data-todo-text]').classList.toggle('line-through')
    parentEl.classList.toggle('completed')
    targetEl.classList.toggle('background-image')
    completeTodo(targetEl.id)
    leftItems.innerHTML = getLeftItems()
  }
})

const loadTodos = () => {
  const readLocalStorage = getLocalStorage()
  readLocalStorage.forEach(createTodo)
}

loadTodos()

form.addEventListener('submit', e => {
  e.preventDefault()
  if(todoInput.value != ''){
    saveTodo()
    leftItems.innerHTML = getLeftItems()
  }
})