console.log('bye world');

/**
 * * ----- Event Delegation --------
 */


const itemsContainer = document.querySelectorAll('.items-container') as NodeListOf<HTMLDivElement>;

function addContainerListeners(currentContainer: HTMLDivElement) {

    
    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn') as HTMLButtonElement;

    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn') as HTMLButtonElement;

    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn') as HTMLButtonElement;

    const currentForm = currentContainer.querySelector('form') as HTMLFormElement;

    deleteBtnListeners(currentContainerDeletionBtn);
    addItemBtnListeners(currentAddItemBtn);
    closeFormBtnListeners(currentCloseFormBtn);
    addFormSubmitListeners(currentForm);
    addDDListeners(currentContainer);
};

itemsContainer.forEach((container: HTMLDivElement) => {
    addContainerListeners(container)
});

function deleteBtnListeners(btn: HTMLButtonElement) {

    btn.addEventListener('click', handleContainerDeletion);
};


function handleContainerDeletion(event: MouseEvent) {

    const btn = event.target as HTMLButtonElement;
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')] as HTMLButtonElement[];
    const containers = [...document.querySelectorAll('.items-container')] as HTMLDivElement[];

    containers[btnsArray.indexOf(btn)].remove( )
};


/**
 **--------- Toggle functionality -----------
 */


let actualContainer: HTMLDivElement;
let actualBtn: HTMLButtonElement;
let actualUl: HTMLUListElement;
let actualForm: HTMLFormElement;
let actualTextInput: HTMLInputElement;
let actualValidation: HTMLSpanElement;

//A) Adding constants to HOF addContainerListeners
//A.1) There's the concept of Event Delegations
//A.2) Handler functions need to be named and not anonymous, so they can be removed
//A.4) Those are paradigms of functional programming

function addItemBtnListeners(btn:HTMLButtonElement) {

    btn.addEventListener('click', handleAddItem);
};

function closeFormBtnListeners(btn: HTMLButtonElement) {

    btn.addEventListener('click', () => { toggleForm(actualBtn, actualForm, false);})
};

function handleAddItem(event: MouseEvent) {

    if(actualContainer) toggleForm(actualBtn, actualForm, false);

    const btn = event.target as HTMLButtonElement;
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true)
};

function setContainerItems(btn: HTMLButtonElement) {

    actualBtn = btn;

    actualContainer = btn.parentElement as HTMLDivElement;

    actualUl = actualContainer.querySelector('ul') as HTMLUListElement;

    actualForm = actualContainer.querySelector('form') as HTMLFormElement;

    actualTextInput = actualContainer.querySelector('input') as HTMLInputElement;

    actualValidation = actualContainer.querySelector('.validation-msg') as HTMLSpanElement;
};

function toggleForm(btn: HTMLButtonElement, form: HTMLFormElement, action: Boolean) {

    if(!action){
        form.style.display = "none";
        btn.style.display = "block";
    } else if (action){
        form.style.display = "block";
        btn.style.display = "none";
    };
};

/**
 * * --------- Add & Destroy an item ----------
 * Submit handling
 */


function addFormSubmitListeners(form: HTMLFormElement) {

    form.addEventListener('submit', createNewItem)
};

function createNewItem(event: Event) {

    event.preventDefault();
    // Validation message
    if(actualTextInput.value.length === 0){
        actualValidation.textContent = "Must be at least 1 character long"
        return;
    } else {
        actualValidation.textContent = "";
    };
    //Item creation
    const itemContent = actualTextInput.value;
    const li = `
    <li class="item" draggable="true">
    <p> ${itemContent}</p>
    <button>X</button>
    </li>
    `;
    actualUl.insertAdjacentHTML('beforeend', li);

    const item = actualUl.lastElementChild as HTMLLIElement;

    const liBtn = item.querySelector('button') as HTMLButtonElement;

    handleItemDeletion(liBtn);

    addDDListeners(item);

    actualTextInput.value = "";

};

function handleItemDeletion(btn:HTMLButtonElement) {

    btn.addEventListener('click', () => {
        
        const elToRemove = btn.parentElement as HTMLLIElement;
        elToRemove.remove();
        
    });
};

/**
 * * ------ Adding a new container functionality   ---------
 */

const addContainerBtn = document.querySelector('.add-container-btn') as HTMLButtonElement;

const addContainerForm = document.querySelector('.add-new-container form') as HTMLFormElement;

const addContainerFormInput = document.querySelector('.add-new-container input') as HTMLInputElement;

const validationNewContainer = document.querySelector('.add-new-container .validation-msg') as HTMLSpanElement;

const addContainerCloseBtn = document.querySelector('.close-add-list') as HTMLButtonElement;

const addNewContainer = document.querySelector('.add-new-container') as HTMLDivElement;

const containersList = document.querySelector('.main-content') as HTMLDivElement;

addContainerBtn.addEventListener('click', () => {
    
    toggleForm(addContainerBtn, addContainerForm, true);
    
});


addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
});

addContainerForm.addEventListener('submit', createNewContainer);

function createNewContainer(event: Event) {

    event.preventDefault();
     // Validation message
     if(addContainerFormInput.value.length === 0){
        validationNewContainer.textContent = "Must be at least 1 character long"
        return;
    } else {
        validationNewContainer.textContent = "";
    };

    //Container creation
    const itemsContainer = document.querySelector('.items-container') as HTMLDivElement;

    const newContainer = itemsContainer.cloneNode() as HTMLDivElement;

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
};

/**
 ** ----- Drag & Drop System : Containers ------
 */

function addDDListeners(element: HTMLElement) {

    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);

};

let dragSrcEl: HTMLElement;

function handleDragStart(this: HTMLElement, event: DragEvent) {

    event.stopPropagation();

    if(actualContainer) toggleForm(actualBtn, actualForm, false);

    dragSrcEl = this;

    event.dataTransfer?.setData('text/html', this.innerHTML);
    // TypeScript error yet to be fixed => Open source
    //event.dataTransfer "may potientally" be null, tho unrealistic, more likely not
    // So it does require Optional Chaining
};

function handleDragOver(event: DragEvent) {

    event.preventDefault();
    //Actually does not know what I'm preventing
    // Dragover API & Events are a little old, curiously most forums know this must be prevented, but didn't find why
};

function handleDrop(this: HTMLElement, event: DragEvent) {

    const receptionEl = this;

    //First case : if it's a li
    if(dragSrcEl.nodeName === "LI" && receptionEl.classList.contains('items-container')){
        (receptionEl.querySelector('ul') as HTMLUListElement).appendChild(dragSrcEl);
        //Dropped elements lose their events
        //So they need to be reinitialized
        addDDListeners(dragSrcEl);
        handleItemDeletion(dragSrcEl.querySelector('button') as HTMLButtonElement);
    }

    if(dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]){
        //swap code
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = event.dataTransfer?.getData('text/html') as string;
        //? as string; This line had Type Casting;
        //? Because it may returned undefined

        //*The swap is an illusion, it looks like we're taking one and putting it somewhere else but in reality. None of them actually move, their data does.

        if(this.classList.contains('items-container')){
            addContainerListeners(this as HTMLDivElement);

            this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
                handleItemDeletion(li.querySelector('button') as HTMLButtonElement);
                addDDListeners(li);
            });
        } else {
            addDDListeners(this)
            handleItemDeletion(this.querySelector('button') as HTMLButtonElement)
        };

    }
};

//!Last evenHandler is very important! The element that got swapped also lost its eventListeners! They need to be reinitialized

function handleDragEnd(this: HTMLElement, event: DragEvent) {
    event.stopPropagation();
    if(this.classList.contains('items-container')){
        addContainerListeners(this as HTMLDivElement);
        //Type Casting is needed because function parameters are typed : TypeScript
        
        this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
            handleItemDeletion(li.querySelector('button') as HTMLButtonElement);
            addDDListeners(li);
        });
        
    } else {
        addDDListeners(this)
        //Also typed-function-parameter function but infered to HTMLElement
    }
};