const http = require('http');

const hostname  = 'localhost';
const port      = 8080;

let server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('It works!');
});

server.listen(port, hostname, () => {
    console.log(`Server running @ http://${hostname}:${port}`);
});
