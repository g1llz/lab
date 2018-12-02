import Http from './services/Http.js';
import Card from './models/Card.js';

const card = new Card();

document.getElementById('btn-import').onclick = async () => {
    try {
        let response = await Http.get('https://randomuser.me/api/');
        card.add({
            name: response.results[0].name.first,
            photo: response.results[0].picture.large
        });

    } catch(e) {
        console.error(e);
    }
}
