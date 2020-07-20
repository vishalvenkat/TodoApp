import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe, Time } from '@angular/common';
@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  form: FormGroup;
  pipe = new DatePipe('en-us');
  minDate: Date = new Date();
  minTimeError:string =  `Minimum time must be ${this.minDate.getHours()}:${this.minDate.getMinutes() + 2}`;
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
    let newStartDate = this.pipe.transform(this.form.get('startDate').value, 'MM/dd/yyyy');
    let statusFromForm = this.form.get('status').value === '' ? 'Open' : this.form.get('status').value;
    this.dialogRef.close({title: this.form.get('title').value,
    description: this.form.get('description').value, startDate: newStartDate,
     startTime: this.form.get('startTime').value,  status: statusFromForm});
  }
  initialiseFormGroup = () => {
    this.form = new FormGroup({
      title: new FormControl(this.data.title, Validators.required),
      description: new FormControl(this.data.description, Validators.required),
      startDate: new FormControl(this.data.startDate, Validators.required),
      startTime: new FormControl(this.data.startTime, [Validators.required]),
      status: new FormControl(this.data.status)
    });
    if (this.data.edit === true) {
      this.form.disable();
    }
  }
getMinTime = () => {

}
  editTodo = () => {
    this.data.edit = false;
    this.form.enable();
  }
  formValidate = () => {
   if (this.form.get('startDate').value === '' || this.form.get('startTime').value === '') return true;
   let today = new Date();
   let date = new Date(this.form.get('startDate').value);
   let dateInForm = date.getDate();
   if (today.getDate() === dateInForm) {
     let hoursAndMinutes = this.form.get('startTime').value;
     let hours = hoursAndMinutes.split(':');
      if(hours[0] < today.getHours() || hours[1] < today.getMinutes() + 2) {
        return true;
      }
   }
  return !this.form.valid;
  }
}
