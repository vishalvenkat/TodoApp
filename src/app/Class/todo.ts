export class Todo {
    todoId: number;
    userId: number;
    todoTitle: string;
    todoDescription: string;
    startTime: Date;
    endTime: Date;
    status: string;

    constructor(todoId: number, userId: number, todoTitle: string,
        todoDescription: string, startTime: Date, endTime: Date, status: string) {
            this.todoId = todoId;
            this.userId = userId;
            this.todoTitle = todoTitle;
            this.todoDescription = todoDescription;
            this.startTime = startTime;
            this.endTime = endTime;
            this.status = status;
    }
}
