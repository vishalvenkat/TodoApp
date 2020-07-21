import { Component, OnInit, ViewChild } from '@angular/core';
import {TodoService} from '../../Services/todo.service';
import { UserService } from 'src/app/Services/user.service';
import {Todo} from '../../Class/todo';
import { MatDialog } from '@angular/material/dialog';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { EditPromptComponent } from '../edit-prompt/edit-prompt.component';
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
    this.userService.isLoggedIn.emit(true);
    this.user = this.userService.name;
    this.todoService.userId = this.userService.userId;
    this.initOpenTodoList();
    this.initInProgressTodoList();
    this.initCompletedTodoList();
    this.map = new Map<string, string>();
    this.map.set('cdk-drop-list-3', 'Open');
    this.map.set('cdk-drop-list-4','InProgress');
    this.map.set('cdk-drop-list-5','Completed');
    this.notifyUser();
  }
  notifyUser = () => {
    let nextSecond = this.todoService.getOpenTodosNow();
    if (nextSecond.pastTodos.length > 0) {
      for (let todos of nextSecond.pastTodos){
        this.showNotification(todos, true);
        let ref = this.editPrompt(todos.status, 'InProgress', todos.todoTitle);
        ref.afterClosed().subscribe(result => {
          if(result === 'true') {
            todos.status = 'InProgress';
            this.todoService.updateTodo(todos);
            this.initOpenTodoList();
            this.initInProgressTodoList();
          } else {
            this.editTodo(todos);
          }
        })
      }
    }
    if(nextSecond.seconds !== -1) {
      let notificationTimeout = setTimeout (() => {
        this.showNotification(nextSecond.title, false);
        let ref = this.editPrompt(nextSecond.title.status, 'InProgress', nextSecond.title.todoTitle);
        ref.afterClosed().subscribe(result => {
          if(result === 'true') {
            nextSecond.title.status = 'InProgress';
            this.todoService.updateTodo(nextSecond.title);
            this.initOpenTodoList();
            this.initInProgressTodoList();
          } else {
            this.editTodo(nextSecond.title);
          }
        })
      }, nextSecond.seconds);
      // clears the notification whenever the user logout
      this.userService.isLoggedIn.subscribe((loggedIn: boolean) => {
        if(!loggedIn) {
          console.log(`logged out successfully`);
          clearTimeout(notificationTimeout);
        } 
      })
    }
  }
  showNotification = (todo: Todo, past: boolean) => {
    let notification: Notification;
    if (past) {
      notification = new Notification('You might have missed', {
        body: `Hi ${this.userService.name}, Your todo: ${todo.todoTitle} is past due`,
        icon: '../../../assets/Images/Logo.png'
      });
    }
    else {
      notification = new Notification('Time to kick start!!', {
        body: `Hi ${this.userService.name}, time to start ${todo.todoTitle}`,
        icon: '../../../assets/Images/Logo.png'
      });
    }
}
  addTodos = (): void  => {
      let ref = this.matdialog.open(AddTodoComponent, {data: {
        edit: false,
        title: '', description: '', dueDate: '', dueTime: '',  status: ''
      }});
      ref.afterClosed().subscribe(result => {
        console.log('closed while add')
        if(result !== undefined) {
        this.todoService.addTodo(result.title, result.description, result.dueDate, result.dueTime, result.status);
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
      dueDate: new Date(todo.dueDate), dueTime: todo.dueTime, status: todo.status
    }});
    ref.afterClosed().subscribe(data => {
      if (data !== undefined) {
        todo.todoTitle = data.title;
        todo.todoDescription = data.description;
        todo.dueDate = data.dueDate;
        todo.dueTime = data.dueTime;
        let previousStatus = todo.status;
        todo.status = data.status;
        this.todoService.updateTodo(todo);
        this.updateTodoList(previousStatus);
        this.updateTodoList(data.status);
        if (data.status === 'Open') this.notifyUser();
      }
    })
  }

  dragAndDrop = (event: CdkDragDrop<Todo[]>, dataSource: any) => {
    let table = this.getTable(event.container.id);
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      table.renderRows();
    } else {
      let targetTable = this.getTable(event.previousContainer.id);
      let ref = this.editPrompt(this.map.get(event.previousContainer.id), this.map.get(event.container.id), event.previousContainer.data[event.previousIndex].todoTitle);
      ref.afterClosed().subscribe(result => {
        if (result === 'true') {
          if(this.map.get(event.container.id) === 'Open'){
            console.log(event.previousContainer.data[event.previousIndex].todoTitle);
            this.editTodo(event.previousContainer.data[event.previousIndex]);
            targetTable.renderRows();
            table.renderRows();       
          } else{
            transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
            console.log(this.getTable(event.previousContainer.id));
            targetTable.renderRows();
            event.container.data[event.currentIndex].status = this.map.get(event.container.id);
            this.todoService.updateTodo(event.container.data[event.currentIndex]);
            table.renderRows();                
        }}
      })
  }
  }
  getTable = (tableName: string) :MatTable<Todo> => {
    switch(tableName) {
      case 'cdk-drop-list-3': return this.table;
      case 'cdk-drop-list-4': return this.table1;
      case 'cdk-drop-list-5': return this.table2;
    }
  }
  editPrompt = (currentStatus: string, newStatus: string, todoTitle: string) => {
    let ref = this.matdialog.open(EditPromptComponent, {data: {
      currentStatus: currentStatus, newStatus: newStatus, title: todoTitle
    }});
      return ref;
  }
}
