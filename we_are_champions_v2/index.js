import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getDatabase, ref, push, onValue, update } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js';

const appSettings = {
    databaseURL: "https://playground-608ca-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const messageInDB = ref(database, 'Messages');

const endorsementFormEl = document.getElementById('endorsementForm');
const endorsementFieldEl = document.getElementById('endorsement-field');
const fromEl = document.getElementById('from');
const toEl = document.getElementById('to');
const endorsementsEl = document.getElementById('endorsements');
const titleEl = document.getElementById('title');

endorsementFormEl.addEventListener('submit', (e) => {
    const endorsement = endorsementFieldEl.value;
    const from = fromEl.value;
    const to = toEl.value;

    const message = { endorsement, from, to, like: 0 };

    e.preventDefault();
    clear(endorsementFieldEl, 'value');
    clear(fromEl, 'value');
    clear(toEl, 'value');
    push(messageInDB, message);
})

onValue(messageInDB, (snapshot) => {
    if (snapshot.exists()) {
        clear(endorsementsEl, 'textContent')
        const endorsements = Object.entries(snapshot.val());

        endorsements.length > 1 ?
            titleEl.textContent = '- Endorsements -' :
            titleEl.textContent = '- Endorsement -';
        endorsements.forEach(element => {
            const [itemId, item] = Object.entries(element);
            const { endorsement, to, from, like } = item[1];
            const endorsementEl = document.createElement('li');
            const fromEl = document.createElement('p');
            const toEl = document.createElement('p');
            const messageEl = document.createElement('p');
            const likeEl = document.createElement('span');
            const bottomEl = document.createElement('div');

            bottomEl.classList += 'bottom';

            fromEl.textContent = `From ${from}`;
            fromEl.classList += 'accent'

            toEl.textContent = `To ${to}`;
            toEl.classList += 'accent'

            messageEl.textContent = endorsement.replace(/(?:\r\n|\r|\n)/g, '<br />');

            likeEl.textContent = `${like > 0 ? like + " ❤" : like + " ♡"}`
            likeEl.classList += 'btn-like'
            likeEl.addEventListener("click", () => {
                const exactLocationOfItemInDB = ref(database, `Messages/${itemId[1]}`);
                const count = like + 1;

                update(exactLocationOfItemInDB, { ...item[1], like: count })
            })

            endorsementEl.append(toEl);
            endorsementEl.append(endorsement);
            bottomEl.append(fromEl);
            bottomEl.append(likeEl);
            endorsementEl.append(bottomEl)


            // endorsementEl.innerHTML = `
            //     <p class="accent">To ${to}</p>
            //     <p>
            //         ${endorsement.replace(/(?:\r\n|\r|\n)/g, '<br />')}
            //     </p>
            //     <div class ="bottom">
            //         <p class="accent">From ${from}</p>
            //         <span id="like" onclick="updateLike()">${like > 1 ? like + " ❤" : like + " ♡"}</span>
            //     </div>
            // `

            endorsementsEl.append(endorsementEl);
        });
    }
})

function clear(htmlEl, prop) {
    htmlEl[prop] = "";
}