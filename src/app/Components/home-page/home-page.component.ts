import { Component, OnInit } from '@angular/core';
import {TodoService} from '../../Services/todo.service';
import { UserService } from 'src/app/Services/user.service';
import {Todo} from '../../Class/todo';
import { MatDialog } from '@angular/material/dialog';
import { AddTodoComponent } from '../add-todo/add-todo.component';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
user: string;
todos: Todo[];
  constructor(private todoService: TodoService, private userService: UserService, private addTodo:MatDialog) { }

  ngOnInit(): void {
    this.user = this.userService.name;
    this.todoService.userId = this.userService.userId;
    this.todos = this.todoService.getTodos();
  }

  addTodos = () => {
      let ref = this.addTodo.open(AddTodoComponent);
      ref.afterClosed().subscribe(result => {
        this.todoService.addTodo(result.title, result.description, new Date(result.startDate), new Date(result.endDate));
//        console.log(result);
      })
  }
}
