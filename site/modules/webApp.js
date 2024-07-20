import Renderer from './renderer.js'
import View from './view.js'
import Controller from './controller.js'

function debounce(callback, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(this, args); }, wait);
    };
}

class WebApp {

    constructor(gapi, google) {
        this.view = new View();
        this.controller = new Controller(this.view, gapi, google);
        this.renderer = new Renderer(this.view);
    }

    start() {
        this.view.load();
        this.renderer.render();

        this.addEventListeners();
//        this.addHandlers();
    }

    async addEventListeners() {
        // TODO: Properly scope for fr callback
        var controller = this.controller;
        var renderer = this.renderer;
        document.getElementById('credential-file').addEventListener('change',
            async function () {
                let fr = new FileReader();
                fr.onload = async function () {
                    console.log("Credential file changed");
                    let credentials = JSON.parse(fr.result);
                    await controller.setCredentials(credentials);
                    await renderer.render();
                }

                await fr.readAsText(this.files[0]);
            });

        console.debug("Registered listeners");
    }
}

export default WebApp;