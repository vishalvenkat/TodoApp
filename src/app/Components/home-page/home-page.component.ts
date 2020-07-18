import { Component, OnInit, ViewChild } from '@angular/core';
import {TodoService} from '../../Services/todo.service';
import { UserService } from 'src/app/Services/user.service';
import {Todo} from '../../Class/todo';
import { MatDialog } from '@angular/material/dialog';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  @ViewChild('table') table: MatTable<Todo>;
  @ViewChild('table1') table1: MatTable<Todo>;
  @ViewChild('table2') table2: MatTable<Todo>;
user: string;
todos: Todo[];
openTodoList: Todo[];
inProgressTodoList: Todo[];
completedTodoList: Todo[];
displayedColumns: string[] = ['Title'];
dataSourceForOpenTodo: any;
dataSourceForInProgressTodo: any;
dataSourceForCompletedTodo: any;
  constructor(private todoService: TodoService, private userService: UserService, private addTodo:MatDialog) { }

  ngOnInit(): void {
    this.user = this.userService.name;
    this.todoService.userId = this.userService.userId;
    this.initOpenTodoList();
    this.initInProgressTodoList();
    this.initCompletedTodoList();
  }

  addTodos = (): void  => {
      let ref = this.addTodo.open(AddTodoComponent, {data: {
        edit: false,
        title: '', description: '', startDate: '', endDate: '', startTime: '', endTime: '', status: ''
      }});
      ref.afterClosed().subscribe(result => {
        console.log('closed while add')
        if(result !== undefined) {
          console.log(`start date = ${result.startDate}, endDate = ${result.endDate}, startTime = ${result.startTime}, endTime = ${result.endTime}`);
        this.todoService.addTodo(result.title, result.description, new Date(result.startDate), new Date(result.endDate), result.status);
        this.updateTodoList(result.status);
      }
    })
  }
  updateTodoList = (status: string) : void => {
    switch (status) {
      case 'Open': this.initOpenTodoList();
      break;
      case 'InProgress': this.initInProgressTodoList();
      break;
      case 'Completed': this.initCompletedTodoList();
    }
  }
  initOpenTodoList = (): void  => {
    this.openTodoList = this.todoService.getTodosWithFilter('Open');
    this.dataSourceForOpenTodo = this.openTodoList;
  }
  initInProgressTodoList = (): void  => {
    this.inProgressTodoList = this.todoService.getTodosWithFilter('InProgress');
    this.dataSourceForInProgressTodo = this.inProgressTodoList;
  }
  initCompletedTodoList = (): void  => {
    this.completedTodoList = this.todoService.getTodosWithFilter('Completed');
    this.dataSourceForCompletedTodo = this.completedTodoList;
  }
  editTodo = (todo: Todo) => {
    let ref = this.addTodo.open(AddTodoComponent, {data: {
      edit: true,
      title: todo.todoTitle, description: todo.todoDescription,
      startDate: '', endDate: '', startTime: todo.startTime, endTime: todo.endTime, status: todo.status
    }});
    ref.afterClosed().subscribe(data => {
      if (data !== undefined) {
        todo.todoTitle = data.title;
        todo.todoDescription = data.description;
        todo.startTime = data.startDate;
        todo.endTime = data.endDate;
        this.updateTodoList(todo.status);
        todo.status = data.status;
        console.log(`updated todo status: ${todo.status}`);
        this.todoService.updateTodo(todo);
        this.updateTodoList(data.status);
      }
    })
  }

  dragAndDrop = (event: CdkDragDrop<Todo[]>, dataSource: any) => {
    let table = this.getTable(event.container.id);
    console.log(event.container.id);
    console.log(event.previousContainer.id);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let targetTable = this.getTable(event.previousContainer.id);
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      targetTable.renderRows();                   
    }
    table.renderRows();
  }
  getTable = (tableName: string) :MatTable<Todo> => {
    switch(tableName) {
      case 'cdk-drop-list-0': return this.table;
      case 'cdk-drop-list-1': return this.table1;
      case 'cdk-drop-list-2': return this.table2;
    }
  }
}
