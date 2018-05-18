// Dependencies
const Server    = require('./server');

// Configuration
const config = {
    hostname    : 'localhost',
    port        : 8080,
    charset     : 'utf-8',
    filePath   : '../data.csv'
};


let server = new Server(config);
server.on('server-info', e => console.log(`[${(new Date()).toISOString()}] [INFO] ${e}`));
server.on('server-error', e => console.error(`[${(new Date()).toISOString()}] [ERROR] ${e}`));
server.start();
