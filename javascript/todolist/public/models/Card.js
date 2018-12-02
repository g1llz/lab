import CardView from '../views/CardView.js';

export default class Card {

    constructor() {
        this.card = [];
        this.element = document.querySelector('#custom-cards');
    }

    add(data) {
        this.card.push(data);
        new CardView(this.element).update(this.card);
    }

}