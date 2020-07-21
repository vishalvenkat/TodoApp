export class Todo {
    todoId: number;
    userId: number;
    todoTitle: string;
    todoDescription: string;
    dueDate: Date;
    status: string;
    dueTime: Date;


    constructor(todoId: number, userId: number, todoTitle: string,
        todoDescription: string, dueDate: Date,dueTime: Date, status: string) {
            this.todoId = todoId;
            this.userId = userId;
            this.todoTitle = todoTitle;
            this.todoDescription = todoDescription;
            this.dueDate = dueDate;
            this.dueTime = dueTime;
            this.status = status;
    }
}
