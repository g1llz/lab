import Http from './models/Http.js';
import Todo from './models/Todo.js';

const todo = new Todo();

document.getElementById('btn-import').onclick = async () => {
    try {
        let response = await Http.get('https://randomuser.me/api/');
        todo.add({
            name: response.results[0].name.first,
            photo: response.results[0].picture.large
        });

    } catch(e) {
        console.error(e);
    }
}
