import { Injectable } from '@angular/core';
import {Todo} from '../Class/todo';
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private nextId: number;
  userId: number;
  constructor() {}

  public getTodos = (): Todo[] => {
    let localStorageItem = JSON.parse(localStorage.getItem('Todos'));
    if (localStorageItem === null){
          return [];
   }
   let todoForUser = localStorageItem.Todos.filter((todos: { userId: number; }) => todos.userId === this.userId);
    return todoForUser;
  }

  public removeTodo = (id: number): void => {
    let todos = this.getTodos();
    todos = todos.filter((todo)=> todo.todoId != id);
    this.setLocalStorageTodos(todos);
  }

  public addTodo = (title: string, description: string, startTime: Date, endTime: Date, status: string): void => {
    let todos = this.getTodos();
    let todo = new Todo(todos.length + 1, this.userId, title,description, startTime, endTime, status);
    todos.push(todo);
    this.setLocalStorageTodos(todos);
  }

  private setLocalStorageTodos = (todos: Todo[]): void => {
    localStorage.setItem('Todos', JSON.stringify({ Todos: todos }));
  }
  getTodosWithFilter = (reqStatus: string) : Todo[] => {
    let todoList = this.getTodos();
    todoList = todoList.filter(todo => todo.status === reqStatus);
    return todoList === null? []: todoList;
  }
}
