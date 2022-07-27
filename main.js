import { login, logout } from "./auth.js";
import { getItems, insert, update } from "./firestore.js";
import { getUUID } from "./utils.js";

const buttonLogin = document.querySelector('#btn-login');
const buttonLogout = document.querySelector('#btn-logout');
const formTodo = document.querySelector('#todo-form');
const userInfo = document.querySelector('#user-info');
const todoInput = document.querySelector('#todo-input');
const todosContainer = document.querySelector('#todos-container');

let currentUser;
let todos = [];

firebase.auth().onAuthStateChanged((user) => {
  if(user){
    currentUser = user;
    console.log('Usuario logueado', currentUser.displayName)
    init();
  }else {
    console.log('No hay usuario logueado')
  }
})

buttonLogin.addEventListener('click', async (e) => {
  try {
    currentUser = await login();
  } catch (error) {
    
  }
});

buttonLogout.addEventListener('click', () => {
  logout();
  dontShowUI();
});



formTodo.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('yupi');
  const text = todoInput.value;

  if(text !== ''){
    console.log('ej addTodo')
    addTodo(text);
    todoInput.value = "";
    loadTodos();
  }
});

async function addTodo(text){
  try {
    const todo = {
      id: getUUID(),
      text: text,
      completed: false,
      userid: currentUser.uid,
    }
    const response = await insert(todo);
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}


function init(){
  buttonLogin.classList.add('hidden');
  buttonLogout.classList.remove('hidden');
  formTodo.classList.remove('hidden');
  todoInput.classList.remove('hidden')

  userInfo.innerHTML = `
  <img src="${currentUser.photoURL}" width="32" />
  <span>${currentUser.displayName}</span>
  `;
  loadTodos();
}

async function loadTodos(){
  todosContainer.innerHTML = "";
  todos = [];
  try {
    const response = await getItems(currentUser.uid)
    console.log(response)
    todos = [...response];
    renderTodos()
  } catch (error) {
    console.error(error)
  }
};

function renderTodos(){
  let html = "";
  todos.forEach((todo) => {
    html += `
    <li class='todo'>
      <input type='checkbox' id="${todo.id}" ${todo.completed ? 'checked' : ''}
      <span>${todo.text}</span>
    </li>
    `
  });
  todosContainer.innerHTML = html;

  document.querySelectorAll('#todos-container input[type=checkbox]').forEach((checkbox) => {
    // console.log(checkbox)
    checkbox.addEventListener('change', (e) => {
      const id = checkbox.id;
      const todo = todos.find((todo) => todo.id == id);
      // console.log(todo)
      todo.completed = checkbox.checked;
      // console.log(todo)
      const colecction = todo.idColecction;
      update(colecction, todo);
    });
  })
}

function dontShowUI(){
  buttonLogin.classList.remove('hidden');
  buttonLogout.classList.add('hidden');
  formTodo.classList.add('hidden');
  todoInput.classList.add('hidden');

  userInfo.innerHTML = '';
  todosContainer.innerHTML = '';
}