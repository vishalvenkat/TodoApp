import { Component, OnInit, EventEmitter } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css']
})
export class GetStartedComponent implements OnInit {

  constructor(private userService: UserService,  private matSnackBar: MatSnackBar) { }
  isLoggedIn = new EventEmitter<boolean>();
  ngOnInit(): void {
  }
  login = (credentials: { userName: string; password: string; }) => {
   // console.log(credentials.userName + credentials.password);
    let isLoggedIn = this.userService.login(credentials.userName, credentials.password);
    if (isLoggedIn) this.matSnackBar.open('logged in successfully', '', {duration: 1000});
    else this.matSnackBar.open('Invalid username or password');
    this.isLoggedIn.emit(isLoggedIn);
  }
  registerNewUser = (credentials: {name: string, userName: string; password: string;}) => {
      let newUser = this.userService.registerNewUser(credentials.name, credentials.userName, credentials.password);
      this.matSnackBar.open('User registered successfully', '', {duration: 1000});
      this.login(credentials);
  }
}
