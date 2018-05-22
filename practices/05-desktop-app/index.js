const {app, BrowserWindow}  = require('electron');
const URL                   = require('url');
const path                  = require('path');
const {GetData, PostData}   = require('./src/backend/index.js');

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({width: 640, height: 480});
    mainWindow.loadURL(URL.format({
        pathname    : path.resolve(__dirname, './index.html'),
        protocol    : 'file',
        slashes     : true
    }));

    mainWindow.on('close', () => {
        mainWindow = null;
    });

    //Init micro-services
    let getData = new GetData({path: '/data', port: 3000, ddbb: 'ddbb/data.csv'});
    let postData = new PostData({path: '/data', port: 3001, ddbb: 'ddbb/data.csv'});

    ['info', 'error'].forEach(ev => {
        [getData, postData].forEach(ms => {
            ms.on(ev, e => {console.log(`${(new Date()).toISOString()} [${ev.toUpperCase()}] ${e}`); });
        });
    });

    getData.start();
    postData.start();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

