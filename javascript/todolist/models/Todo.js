import TodoView from '../views/TodoView.js';

export default class Todo {

    constructor() {
        this.todo = [];
        this.element = document.querySelector('#custom-cards');
    }

    add(data) {
        this.todo.push(data);
        new TodoView(this.element).update(this.todo);
    }

}