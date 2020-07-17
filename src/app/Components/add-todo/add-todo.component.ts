import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  todoStatusList = [
    {view: 'Open(yet to start)', value: 'Open'},
    {view: 'In progress', value: 'InProgress'},
    {view: 'Completed', value: 'Completed'}
  ];
  statusValue: string;
  constructor(public dialogRef: MatDialogRef<AddTodoComponent>) { }

  ngOnInit(): void {
  }
  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    startTime: new FormControl('', Validators.required),
    endTime: new FormControl('', Validators.required),
    status: new FormControl('')
  });

  addTodo = () => {
    this.dialogRef.close({title: this.form.get('title').value,
    description: this.form.get('description').value, startDate: this.form.get('startDate').value,
    endDate: this.form.get('endDate').value, startTime: this.form.get('startTime').value, endTime: this.form.get('endTime').value, status: this.form.get('status').value});
  }
}
