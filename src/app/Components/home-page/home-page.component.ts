import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import {TodoService} from '../../Services/todo.service';
import { UserService } from 'src/app/Services/user.service';
import {Todo} from '../../Class/todo';
import { MatDialog } from '@angular/material/dialog';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { EditPromptComponent } from '../edit-prompt/edit-prompt.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit{
  @ViewChild('table') table: MatTable<Todo>;
  @ViewChild('table1') table1: MatTable<Todo>;
  @ViewChild('table2') table2: MatTable<Todo>;
user: string;
todos: Todo[];
openTodoList: Todo[];
inProgressTodoList: Todo[];
completedTodoList: Todo[];
displayedColumns: string[] = ['Title'];
map: Map<string, string>;
dataSourceForOpenTodo: any;
dataSourceForInProgressTodo: any;
dataSourceForCompletedTodo: any;
  constructor(private todoService: TodoService, private userService: UserService, private matdialog:MatDialog, private router:Router) {
    if (userService.userId === undefined) this.router.navigate(['']);
   }

  ngOnInit(): void {
    this.user = this.userService.name;
    this.todoService.userId = this.userService.userId;
    this.initOpenTodoList();
    this.initInProgressTodoList();
    this.initCompletedTodoList();
    this.map = new Map<string, string>();
    this.map.set('cdk-drop-list-0', 'Open');
    this.map.set('cdk-drop-list-1','InProgress');
    this.map.set('cdk-drop-list-2','Completed');

    // To notify user about the Open todo's 
    this.notifyUser();
    
  }
  notifyUser = () => {
    let nextSecond = this.todoService.getOpenTodosNow();
    if(nextSecond.seconds !== -1) {
      setTimeout (() => {
        this.showNotification(nextSecond.title, false);
      }, nextSecond.seconds)
      for (let todos of nextSecond.pastTodos) this.showNotification(todos.todoTitle, true);
    }
    if (nextSecond.seconds === -1 && nextSecond.pastTodos.length > 0) {
      for (let todo of nextSecond.pastTodos) this.showNotification(todo.todoTitle, true);
    }
  }
  showNotification = (title: string, past: boolean) => {
    if (past) {
      const notification = new Notification("You might have missed", {
        body: `Hi ${this.userService.name}, This is past due ${title}`
      });
    } else {
    const notification = new Notification("Time to kick start!!", {
      body: `Hi ${this.userService.name}, time to start ${title}`
    });
    this.notifyUser();
  }
}
  addTodos = (): void  => {
      let ref = this.matdialog.open(AddTodoComponent, {data: {
        edit: false,
        title: '', description: '', startDate: '', startTime: '',  status: ''
      }});
      ref.afterClosed().subscribe(result => {
        console.log('closed while add')
        if(result !== undefined) {
        this.todoService.addTodo(result.title, result.description, result.startDate, result.endDate, result.startTime, result.endTime, result.status);
        this.updateTodoList(result.status);
        if (result.status === 'Open') this.notifyUser();
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
    let ref = this.matdialog.open(AddTodoComponent, {data: {
      edit: true,
      title: todo.todoTitle, description: todo.todoDescription,
      startDate: new Date(todo.startDate), startTime: todo.startTime, status: todo.status
    }});
    ref.afterClosed().subscribe(data => {
      if (data !== undefined) {
        todo.todoTitle = data.title;
        todo.todoDescription = data.description;
        todo.startDate = data.startDate;
        this.updateTodoList(todo.status);
        todo.status = data.status;
        this.todoService.updateTodo(todo);
        this.updateTodoList(data.status);
        if (data.status === 'Open') this.notifyUser();
      }
    })
  }

  dragAndDrop = (event: CdkDragDrop<Todo[]>, dataSource: any) => {
    let table = this.getTable(event.container.id);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      table.renderRows();
    } else {
      let targetTable = this.getTable(event.previousContainer.id);
      let ref = this.editPrompt(this.map.get(event.previousContainer.id), this.map.get(event.container.id));
      ref.afterClosed().subscribe(result => {
        if (result === 'true') {
            transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
            targetTable.renderRows();
            event.container.data[event.currentIndex].status = this.map.get(event.container.id);
            this.todoService.updateTodo(event.container.data[event.currentIndex]);
            table.renderRows();                
        }
      })
  }
  }
  getTable = (tableName: string) :MatTable<Todo> => {
    switch(tableName) {
      case 'cdk-drop-list-0': return this.table;
      case 'cdk-drop-list-1': return this.table1;
      case 'cdk-drop-list-2': return this.table2;
    }
  }
  editPrompt = (currentStatus: string, newStatus: string) => {
    let ref = this.matdialog.open(EditPromptComponent, {data: {
      currentStatus: currentStatus, newStatus: newStatus
    }});
      return ref;
  }
}
