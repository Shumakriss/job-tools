class Modal {
// Stores a modal together with its id, button Id, and its DOM elements with helper functions
    constructor(id, buttonId) {
        this.id = id;
        this.buttonId = buttonId;
        this.element = document.getElementById(id);
        this.buttonElement = document.getElementById(buttonId);
        this.buttonElement.onclick = async () => { this.show(); };
    }

    show() {
        this.element.style.display = "block";
    }

    clear() {
        this.element.style.display = "none";
    }
}

class ModalCollection {
// Stores several modals together so they can added concisely and cleared together
    constructor() {
        this.modals = new Map();
    }

    clickAway(elementId){
        if (this.modals.has(elementId)) {
            this.modals.get(elementId).clear();
        }
    }

    add(modalId, modalButtonId) {
        let modal = new Modal(modalId, modalButtonId);
        this.modals.set(modal.id, modal);
    }

    clear(modalId) {
        this.modals.get(elementId).clear();
    }

    clearAll() {
        this.modals.forEach((modal, id) => { modal.clear(); });
    }
}

export default ModalCollection;