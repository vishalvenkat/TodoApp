import { Component, OnInit, EventEmitter } from '@angular/core';
import { UserService } from '../../Services/user.service';
@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css']
})
export class GetStartedComponent implements OnInit {

  constructor(private userService: UserService) { }
  isLoggedIn = new EventEmitter<boolean>();
  ngOnInit(): void {
  }
  login = (credentials: { userName: string; password: string; }) => {
   // console.log(credentials.userName + credentials.password);
    let isLoggedIn = this.userService.login(credentials.userName, credentials.password);
    this.isLoggedIn.emit(isLoggedIn);
  }
  registerNewUser = (credentials: {name: string, userName: string; password: string;}) => {
      let newUser = this.userService.registerNewUser(credentials.name, credentials.userName, credentials.password);
      this.login(credentials);
  }
}
