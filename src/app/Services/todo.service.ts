import { Injectable } from '@angular/core';
import {Todo} from '../Class/todo';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  userId: number;
  constructor() {}

  getTodos = (): Todo[] => {
    let localStorageItem = JSON.parse(localStorage.getItem('todos'));
    return localStorageItem === null ?  [] :  localStorageItem.todos;
  }
  getTodosForUser = (): Todo[] => {
    let todoList = this.getTodos();
    let todoForUser = todoList.filter(todos => todos.userId === this.userId);
    return todoForUser;
  }
    addTodo = (title: string, description: string, startDate: Date, startTime: Date, status: string): void => {
    let todos = this.getTodos();
    let todo = new Todo(todos.length + 1, this.userId, title, description, startDate,  startTime, status);
    todos.push(todo);
    this.setLocalStorageTodos(todos);
  }

    setLocalStorageTodos = (todos: Todo[]): void => {
    localStorage.setItem('todos', JSON.stringify({todos}));
  }
  getTodosWithFilter = (reqStatus: string) : Todo[] => {
    let todoList = this.getTodosForUser();
    todoList = todoList.filter(todo => todo.status === reqStatus);
    return todoList === null? []: todoList;
  }
  updateTodo = (todo: Todo): void => {
    let todoList = this.getTodos();
    let index = todoList.findIndex(todos => todos.todoId === todo.todoId);
    todoList[index] = todo;
    this.setLocalStorageTodos(todoList);
  }
  getOpenTodosNow = () => {
    let todoList = this.getTodosWithFilter('Open');
    if (todoList.length === 0) return {seconds:-1, title: null, pastTodos:[]};
    let today = new Date();
    let pipe = new DatePipe('en-us');
    let minSeconds = today.valueOf();
    let latestTodoName: Todo;
    let pastTodos: Todo[] = [];
    let updatedTodoList = todoList.filter(todos => todos.dueDate.toString() === pipe.transform(today, 'MM/dd/yyyy'));
    updatedTodoList.forEach(todos => {
    let date = new Date(todos.dueDate);
    let hoursAndMinutes = todos.dueTime.toString().split(':');
    date.setHours(Number(hoursAndMinutes[0]));
    date.setMinutes(Number(hoursAndMinutes[1]));
    let localMin = date.valueOf() - today.valueOf();
    if (localMin > 0 && localMin < minSeconds){
         minSeconds = localMin;
         latestTodoName = todos;
      } else {
          pastTodos.push(todos);
      }
    });
    if (minSeconds === today.valueOf() && pastTodos.length === 0){
      console.log('No new and past todos');
      return {seconds: -1, title: null, pastTodos: []};
    }
    if (pastTodos.length > 0 && minSeconds === today.valueOf()) {
      console.log(`No new but have past ${pastTodos.length}`);
      return {seconds: -1, title:null, pastTodos:pastTodos};
    } 
    console.log('Have new ones');
    return {seconds:minSeconds,title:latestTodoName, pastTodos: pastTodos};
  }
}
