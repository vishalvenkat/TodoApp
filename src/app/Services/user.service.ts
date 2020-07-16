import { Injectable } from '@angular/core';
import { User } from '../Class/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
nextId: number;
name: string;
userId: number;
  constructor() { 
    let userList = this.getUserList();
    userList.length === 0 ? this.nextId = 0 : this.nextId = userList[userList.length - 1].userId + 1; 
  }
  login = (userName: string, password: string) : boolean => {
    let userList = this.getUserList();
    let user = userList.find((UserList: { userName: string; password: string; }) => UserList.userName === userName && UserList.password === password);
    if (user !== undefined) {
      this.name = user.name;
      this.userId = user.userId;
    }
    return user === undefined ? false : true; 
    }
  getUserList = () => {
    let UserList = JSON.parse(localStorage.getItem('User'));
    return UserList === null ? [] : UserList.user;
  }
  
  registerNewUser = (name: string, userName: string, password: string): boolean => {
    if (this.login(userName, password)) {
      return false;
    }
    let newUser = new User(this.nextId++, name, userName, password);
    let userList = this.getUserList();
    userList.push(newUser);
    localStorage.setItem('User', JSON.stringify({ user: userList }));
    return true;
}
}
