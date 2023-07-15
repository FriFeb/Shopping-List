const form = document.querySelector('#item-form');
const inputForm = document.querySelector('#item-input');
const buttonForm = form.querySelector('button');
const filter = document.querySelector('#filter');
const list = document.querySelector('#item-list');
const clearButton = document.querySelector('#clear');
let isEditMode = false;

//      //      //      Adding product      \\      \\      \\
function onAddItem(e) {

    e.preventDefault();
    productName = inputForm.value;

    if (inputForm.value.trim() === '') {
        alert('Please enter a product name!');
        return;
    }

    if (checkIfItemExist(productName)) {
        alert('Item already exist!');
        return;
    }

    if (isEditMode) {
        console.log(list.children);
        const itemToEdit = list.querySelector('.edit-mode');
        console.log(itemToEdit);

        deleteItemFromStorage(itemToEdit);
        itemToEdit.remove();
        itemToEdit.classList.remove('edit-mode');

        isEditMode = false;
    }

    addItemToDOM(productName);
    addItemToLocalStorage(productName);

    inputForm.value = '';

    checkUI();
}

function addItemToDOM(productName) {
    const listElement = document.createElement('li');
    listElement.appendChild(document.createTextNode(productName));

    btn = createButton('remove-item btn-link text-red');

    listElement.appendChild(btn);
    list.appendChild(listElement);
}

function createButton(className) {
    const button = document.createElement('button');
    button.className = className;
    icon = createIcon('fa-solid fa-plus');
    button.appendChild(icon);
    return button;
}

function createIcon(className) {
    const icon = document.createElement('i');
    icon.className = className;
    return icon;
}

function checkIfItemExist(item) {
    const itemsFromStorage = getItemsFromLocalStorage();
    return itemsFromStorage.includes(item);
}

//      //      //      Producs to/from LocalStorage      \\      \\      \\
function addItemToLocalStorage(productName) {

    const itemsFromStorage = getItemsFromLocalStorage();

    itemsFromStorage.push(productName);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromLocalStorage() {
    let itemsFromStorage = [];

    if (localStorage.getItem('items') !== null) {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function displayItems() {
    const itemsFromStorage = getItemsFromLocalStorage();

    for (const item of itemsFromStorage) {
        addItemToDOM(item);
    }
}

//      //      //      On click List events      \\      \\      \\
function onClickItem(e) {
    const item = e.target;

    if (item.parentElement.classList.value.includes('remove-item')) {
        deleteItem(e.target.parentElement.parentElement);
    }

    if (item.textContent && e.currentTarget !== item) {
        updateItem(item);
    };
}

//      //      //      Updating product      \\      \\      \\
function updateItem(item) {

    inputForm.value = item.textContent;
    isEditMode = true;

    list
        .querySelectorAll('li')
        .forEach(item => { item.classList.remove('edit-mode'); });

    item.classList.add('edit-mode');

    buttonForm.textContent = 'Update item';
    buttonForm.style.backgroundColor = '#0aaaa0'
}

//      //      //      Deleting product(s)      \\      \\      \\
function deleteItem(item) {
    if (confirm('Are you sure you want to remove the item from the list?')) {
        item.remove();

        deleteItemFromStorage(item.textContent);

        checkUI();
    }
}

function deleteItemFromStorage(productName) {
    let itemsFromStorage = getItemsFromLocalStorage();

    itemsFromStorage = itemsFromStorage.filter((value) => value !== productName);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
    if (confirm('Are you sure you want to clear all items from the list?')) {
        while (list.firstChild) {
            list.firstChild.remove();
        }

        localStorage.clear();

        checkUI();
    }
}

//      //      //      Check UI      \\      \\      \\
function checkUI() {
    const items = list.querySelectorAll('li');

    if (items.length === 0) {
        filter.style.display = 'none';
        clearButton.style.display = 'none';
    } else {
        filter.style.display = 'block';
        clearButton.style.display = 'block';
    }

    buttonForm.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
    buttonForm.style.backgroundColor = 'black'

    isEditMode = false;
}

//      //      //      Filter products      \\      \\      \\
function filterItems(e) {
    const items = list.querySelectorAll('li');
    const inputText = e.target.value.toLocaleLowerCase();

    items.forEach((item => {
        item.style.display =
            item.textContent.toLocaleLowerCase().includes(inputText)
                ? 'flex'
                : 'none';
    }));
}

//      //      //      Event listeners      \\      \\      \\
form.addEventListener('submit', onAddItem);
list.addEventListener('click', onClickItem);
clearButton.addEventListener('click', clearItems);
filter.addEventListener('input', filterItems);
displayItems()
checkUI();