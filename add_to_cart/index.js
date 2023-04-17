import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js'

const appSettings = {
    databaseURL: 'https://purchaselists-4ca6d-default-rtdb.europe-west1.firebasedatabase.app/'
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shoppingList');

const addToCartEl = document.getElementById('add-to-cart');
const inputFieldEl = document.getElementById('input-field');
const shoppingListEl = document.getElementById('shopping-list');

addToCartEl.addEventListener('click', () => {
    const newItem = inputFieldEl.value;

    push(shoppingListInDB, newItem);
    clear(inputFieldEl, 'value');
});

onValue(shoppingListInDB, (snapshot) => {

    if (snapshot.exists()) {
        const ItemList = Object.entries(snapshot.val());

        clear(shoppingListEl, 'innerHTML');

        ItemList.forEach(el => {
            const [itemId, item] = el;
            const newItemEl = document.createElement('li');

            newItemEl.textContent = item;
            newItemEl.addEventListener('dblclick', () => {
                const exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`)
                remove(exactLocationOfItemInDB)
            })

            shoppingListEl.append(newItemEl);
        })
    } else {
        shoppingListEl.innerHTML = `<p>There is no item... here yet</p>`
    }
})

function clear(htmlEl, prop) {
    htmlEl[prop] = '';
}