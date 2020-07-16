import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @Output() credentials = new EventEmitter<{name: string, userName: string, password: string}>();
name: string;
userName: string;
password: string;
hide: boolean = true;
right: string = 'right';
  constructor() { }

  ngOnInit(): void {
  }

  register =() => {
    this.credentials.emit({name:this.name, userName:this.userName, password:this.password});
  }
}
