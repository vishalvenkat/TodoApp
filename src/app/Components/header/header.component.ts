import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn:boolean = false;
  constructor(private router: Router, private userService: UserService) {
    userService.isLoggedIn.subscribe((isLoggedIn: boolean) => this.isLoggedIn = isLoggedIn);
   }
  ngOnInit() {
  }
  logout = () => {
    this.router.navigate(['']);
    this.userService.isLoggedIn.emit(false);
  }

}
