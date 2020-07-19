import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe, Time } from '@angular/common';
@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  form: FormGroup;
  minDate: Date = new Date();
  minTime: number = Date.now();
  todoStatusList = [
    {view: 'Open(yet to start)', value: 'Open'},
    {view: 'In progress', value: 'InProgress'},
    {view: 'Completed', value: 'Completed'}
  ];
  pipe = new DatePipe('en-us');
  statusValue: string;
  constructor(public dialogRef: MatDialogRef<AddTodoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.initialiseFormGroup();
  }

  addTodo = () => {
    let newStartDate = this.pipe.transform(this.form.get('startDate').value, 'MM/dd/yyyy');
    this.dialogRef.close({title: this.form.get('title').value,
    description: this.form.get('description').value, startDate: newStartDate,
     startTime: this.form.get('startTime').value,  status: this.form.get('status').value});
  }
  initialiseFormGroup = () => {
    this.form = new FormGroup({
      title: new FormControl(this.data.title, Validators.required),
      description: new FormControl(this.data.description, Validators.required),
      startDate: new FormControl(this.data.startDate, Validators.required),
      startTime: new FormControl(this.data.startTime, Validators.required),
      status: new FormControl(this.data.status)
    });
    if (this.data.edit === true) {
      this.form.disable();
    }
  }
  editTodo = () => {
    this.data.edit = false;
    this.form.enable();
  }
}
