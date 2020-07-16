import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() credentials = new EventEmitter<{userName: string, password: string}>();
  right: string = 'right';
  hide: boolean = true;
  userName: string;
  password: string;
  invalidCredentials: boolean;
    constructor(private matSnackBar: MatSnackBar) { }
  
    ngOnInit() {
    }
  
    login = () => {
      this.credentials.emit({userName: this.userName, password:this.password});
    }
}
