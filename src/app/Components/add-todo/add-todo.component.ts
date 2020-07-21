import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  form: FormGroup;
  pipe = new DatePipe('en-us');
  submitButtonText: string;
  minDate: Date = new Date();
  minTimeError:string;
  todoStatusList: { view: string; value: string; }[];

  constructor(public dialogRef: MatDialogRef<AddTodoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.todoStatusList = [
      {view: 'Open(yet to start)', value: 'Open'},
      {view: 'In progress( Working currently)', value: 'InProgress'},
      {view: 'Completed(Completed successfully)', value: 'Completed'}
    ];
   }

  ngOnInit(): void {
    this.initialiseFormGroup();
  }

  addTodo = () => {
    let newDueDate = this.pipe.transform(this.form.get('dueDate').value, 'MM/dd/yyyy');
    let statusFromForm = this.form.get('status').value === '' ? 'Open' : this.form.get('status').value;
    console.log(`updated status: ${statusFromForm}`);
    this.dialogRef.close({title: this.form.get('title').value,
    description: this.form.get('description').value, dueDate: newDueDate,
     dueTime: this.form.get('dueTime').value,  status: statusFromForm});
  }
  initialiseFormGroup = () => {
    this.form = new FormGroup({
      title: new FormControl(this.data.title, [Validators.required, Validators.maxLength(250)]),
      description: new FormControl(this.data.description, [Validators.required, Validators.maxLength(250)]),
      dueDate: new FormControl(this.data.dueDate, Validators.required),
      dueTime: new FormControl(this.data.dueTime, [Validators.required]),
      status: new FormControl(this.data.status)
    });
    if (this.data.edit === true) this.submitButtonText = `Save Todo`;
    else this.submitButtonText = `Add Todo`;
  }
  formValidate = () => {
   if (this.form.get('dueDate').value === '' || this.form.get('dueTime').value === '') return true;
   let today = new Date();
   let date = new Date(this.form.get('dueDate').value);
   let dateInForm = date.getDate();
   if (this.isValidToCheckTime() && today.getDate() === dateInForm) {
     let hoursAndMinutes = this.form.get('dueTime').value;
     let hours = hoursAndMinutes.split(':');
     if(hours[0] > today.getHours()){
      this.minTimeError = '';
      return false;
     }
     if(hours[0] < today.getHours() || hours[1] < today.getMinutes() + 2){
       this.minTimeError = this.setMinTimeErrorText(today.getHours(), today.getMinutes());
       return true;
      }
   }
   this.minTimeError = '';
  return !this.form.valid;
  }
  isValidToCheckTime = () => {
    if(!this.data.edit) return true;
    if (this.form.get('status').value === 'Open') return true;
    return false;
  }
  setMinTimeErrorText = (hour:number, minute: number): string => {
    let buffer = minute % 57;
    if (buffer < 4) return `Minimum time must be ${hour + 1}:${buffer}`;
      return `Minimum time must be ${hour}:${minute + 2}`; 
  }
}
