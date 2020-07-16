export class User {
    userId: number;
    name: string;
    userName: string;
    password: string;

    constructor(userId: number, name: string, userName: string, password: string){
            this.userId = userId;
            this.name = name;
            this.userName = userName;
            this.password = password;
    }
}
