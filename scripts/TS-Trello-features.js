"use strict";
console.log('bye world');
/**
 * * ----- Event Delegation --------
 */
const itemsContainer = document.querySelectorAll('.items-container');
function addContainerListeners(currentContainer) {
    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn');
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn');
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn');
    const currentForm = currentContainer.querySelector('form');
    deleteBtnListeners(currentContainerDeletionBtn);
    addItemBtnListeners(currentAddItemBtn);
    closeFormBtnListeners(currentCloseFormBtn);
    addFormSubmitListeners(currentForm);
    addDDListeners(currentContainer);
}
;
itemsContainer.forEach((container) => {
    addContainerListeners(container);
});
function deleteBtnListeners(btn) {
    btn.addEventListener('click', handleContainerDeletion);
}
;
function handleContainerDeletion(event) {
    const btn = event.target;
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')];
    const containers = [...document.querySelectorAll('.items-container')];
    containers[btnsArray.indexOf(btn)].remove();
}
;
/**
 **--------- Toggle functionality -----------
 */
let actualContainer;
let actualBtn;
let actualUl;
let actualForm;
let actualTextInput;
let actualValidation;
//A) Adding constants to HOF addContainerListeners
//A.1) There's the concept of Event Delegations
//A.2) Handler functions need to be named and not anonymous, so they can be removed
//A.3) Ce sont des paradigmes de la programmation fonctionnel
function addItemBtnListeners(btn) {
    btn.addEventListener('click', handleAddItem);
}
;
function closeFormBtnListeners(btn) {
    btn.addEventListener('click', () => { toggleForm(actualBtn, actualForm, false); });
}
;
function handleAddItem(event) {
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    const btn = event.target;
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
}
;
function setContainerItems(btn) {
    actualBtn = btn;
    actualContainer = btn.parentElement;
    actualUl = actualContainer.querySelector('ul');
    actualForm = actualContainer.querySelector('form');
    actualTextInput = actualContainer.querySelector('input');
    actualValidation = actualContainer.querySelector('.validation-msg');
}
;
function toggleForm(btn, form, action) {
    if (!action) {
        form.style.display = "none";
        btn.style.display = "block";
    }
    else if (action) {
        form.style.display = "block";
        btn.style.display = "none";
    }
    ;
}
;
/**
 * * --------- Add & Destroy an item ----------
 * Submit handling
 */
function addFormSubmitListeners(form) {
    form.addEventListener('submit', createNewItem);
}
;
function createNewItem(event) {
    event.preventDefault();
    // Validation message
    if (actualTextInput.value.length === 0) {
        actualValidation.textContent = "Must be at least 1 character long";
        return;
    }
    else {
        actualValidation.textContent = "";
    }
    ;
    //Item creation
    const itemContent = actualTextInput.value;
    const li = `
    <li class="item" draggable="true">
    <p> ${itemContent}</p>
    <button>X</button>
    </li>
    `;
    actualUl.insertAdjacentHTML('beforeend', li);
    const item = actualUl.lastElementChild;
    const liBtn = item.querySelector('button');
    handleItemDeletion(liBtn);
    addDDListeners(item);
    actualTextInput.value = "";
}
;
function handleItemDeletion(btn) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement;
        elToRemove.remove();
    });
}
;
/**
 * * ------ Adding a new container functionality   ---------
 */
const addContainerBtn = document.querySelector('.add-container-btn');
const addContainerForm = document.querySelector('.add-new-container form');
const addContainerFormInput = document.querySelector('.add-new-container input');
const validationNewContainer = document.querySelector('.add-new-container .validation-msg');
const addContainerCloseBtn = document.querySelector('.close-add-list');
const addNewContainer = document.querySelector('.add-new-container');
const containersList = document.querySelector('.main-content');
addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);
});
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
});
addContainerForm.addEventListener('submit', createNewContainer);
function createNewContainer(event) {
    event.preventDefault();
    // Validation message
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = "Must be at least 1 character long";
        return;
    }
    else {
        validationNewContainer.textContent = "";
    }
    ;
    //Container creation
    const itemsContainer = document.querySelector('.items-container');
    const newContainer = itemsContainer.cloneNode();
    const newContainerContent = `
            <div class="top-container">
                <h2>${addContainerFormInput.value}</h2>
                <button class="delete-container-btn">
                    X
                </button>
            </div>
            <ul>

            </ul>
            <button class="add-item-btn">
                Add an item
            </button>
            <form autocomplete="off">
                <div class="top-form-container">
                    <label for="">Add a new item</label>
                    <button type="button" class="close-form-btn">
                        X
                    </button>
                </div>
                <input type="text" id="item">
                <span class="validation-msg"></span>
                <button type="submit">
                    Submit
                </button>
            </form>
        `;
    newContainer.innerHTML = newContainerContent;
    containersList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = "";
    addContainerListeners(newContainer);
}
;
/**
 ** ----- Drag & Drop System : Containers ------
 */
function addDDListeners(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}
;
let dragSrcEl;
function handleDragStart(event) {
    event.stopPropagation();
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    dragSrcEl = this;
    event.dataTransfer?.setData('text/html', this.innerHTML);
    //Erreur de typescript, pas encore géré => Open Source
    //event.dataTransfer "peut potentiellement" être nul, bien que invraisemblable
    //Cela nécessite donc du Optional Chaining
}
;
function handleDragOver(event) {
    event.preventDefault();
    //Actually does not know what I'm preventing
    // Dragover API & Events are a little old, curiously most forums know this must be prevented, but didn't find why
}
;
function handleDrop(event) {
    const receptionEl = this;
    //First case : if it's a li
    if (dragSrcEl.nodeName === "LI" && receptionEl.classList.contains('items-container')) {
        receptionEl.querySelector('ul').appendChild(dragSrcEl);
        //Dropped elements lose their events
        //So they need to be reinitialized
        addDDListeners(dragSrcEl);
        handleItemDeletion(dragSrcEl.querySelector('button'));
    }
    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        //swap code
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = event.dataTransfer?.getData('text/html');
        //? as string; This line had Type Casting;
        //? Because it may returned undefined
        //*The swap is an illusion, it looks like we're taking one and putting it somewhere else but in reality. None of them actually move, their data does.
        if (this.classList.contains('items-container')) {
            addContainerListeners(this);
            this.querySelectorAll('li').forEach((li) => {
                handleItemDeletion(li.querySelector('button'));
                addDDListeners(li);
            });
        }
        else {
            addDDListeners(this);
            handleItemDeletion(this.querySelector('button'));
        }
        ;
    }
}
;
//!Last evenHandler is very important! The element that got swapped also lost its eventListeners! They need to be reinitialized
function handleDragEnd(event) {
    event.stopPropagation();
    if (this.classList.contains('items-container')) {
        addContainerListeners(this);
        //Type Casting is needed because function parameters are typed : TypeScript
        this.querySelectorAll('li').forEach((li) => {
            handleItemDeletion(li.querySelector('button'));
            addDDListeners(li);
        });
    }
    else {
        addDDListeners(this);
        //Also typed-function-parameter function but infered to HTMLElement
    }
}
;
