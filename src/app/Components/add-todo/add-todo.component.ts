import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  form: FormGroup;
  todoStatusList = [
    {view: 'Open(yet to start)', value: 'Open'},
    {view: 'In progress', value: 'InProgress'},
    {view: 'Completed', value: 'Completed'}
  ];
  statusValue: string;
  constructor(public dialogRef: MatDialogRef<AddTodoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.initialiseFormGroup();
  }

  addTodo = () => {
    this.dialogRef.close({title: this.form.get('title').value,
    description: this.form.get('description').value, startDate: this.form.get('startDate').value,
    endDate: this.form.get('endDate').value, startTime: this.form.get('startTime').value, endTime: this.form.get('endTime').value, status: this.form.get('status').value});
  }
  initialiseFormGroup = () => {
    this.form = new FormGroup({
      title: new FormControl(this.data.title, Validators.required),
      description: new FormControl(this.data.description, Validators.required),
      startDate: new FormControl(this.data.startDate, Validators.required),
      endDate: new FormControl(this.data.endDate, Validators.required),
      startTime: new FormControl(this.data.startTime, Validators.required),
      endTime: new FormControl(this.data.endTime, Validators.required),
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
