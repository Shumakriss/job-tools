import WebApp from './modules/webApp.js'

// This must run after loading gapi and google scripts in index.html
var app = new WebApp(gapi, google);
app.start();