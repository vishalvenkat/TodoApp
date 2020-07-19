export class Todo {
    todoId: number;
    userId: number;
    todoTitle: string;
    todoDescription: string;
    startDate: Date;
    status: string;
    startTime: Date;


    constructor(todoId: number, userId: number, todoTitle: string,
        todoDescription: string, startDate: Date,startTime: Date, status: string) {
            this.todoId = todoId;
            this.userId = userId;
            this.todoTitle = todoTitle;
            this.todoDescription = todoDescription;
            this.startDate = startDate;
            this.startTime = startTime;
            this.status = status;
    }
}
