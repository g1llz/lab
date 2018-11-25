export default class View {

    constructor(element) {
        this._element = element;
    }

    _template() {
        throw new Error('you should be implemented this method.');
    }

    update(list) {
        this._element.innerHTML = this._template(list);
    }
}