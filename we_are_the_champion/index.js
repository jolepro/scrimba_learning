import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js';

const appSettings = {
    databaseURL: "https://playground-608ca-default-rtdb.europe-west1.firebasedatabase.app/"
}


const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementInDB = ref(database, 'Endorsements');

const endorsementFormEl = document.getElementById('endorsementForm');
const endorsementFieldEl = document.getElementById('endorsement-field');
const endorsementsEl = document.getElementById('endorsements');
const titleEl = document.getElementById('title');

endorsementFormEl.addEventListener('submit', (e) => {
    const endorsement = endorsementFieldEl.value;

    e.preventDefault();
    clear(endorsementFieldEl, 'value');
    push(endorsementInDB, endorsement);
})

onValue(endorsementInDB, (snapshot) => {
    if (snapshot.exists()) {
        clear(endorsementsEl, 'textContent')
        const endorsements = Object.entries(snapshot.val());
        endorsements.length > 0 ?
            titleEl.textContent = '- Endorsements -' :
            titleEl.textContent = '- Endorsement -';
        endorsements.forEach(element => {
            const [itemId, item] = Object.entries(element);
            const endorsementEl = document.createElement('li');

            endorsementEl.innerHTML = item[1].replace(/(?:\r\n|\r|\n)/g, '<br />');

            endorsementsEl.append(endorsementEl);
        });
    }
})

function clear(htmlEl, prop) {
    htmlEl[prop] = "";
}