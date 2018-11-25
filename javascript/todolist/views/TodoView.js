import View from './View.js';

export default class TodoView extends View {
    
    constructor(element) {
        super(element);
    }

    _template(list) {
        return `
        ${list.map(user => `
        <li>
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="${user.photo}" alt="Random user image">
                <div class="card-body">
                    <p class="card-text">${user.name}</p>
                </div>
            </div>
        </li>
        `).join('')}    
        `;
    }
}