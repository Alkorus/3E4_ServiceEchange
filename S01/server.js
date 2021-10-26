const http = require('http');   //Équivalent d'un #include ou de Using

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((request, response) => {

    console.log('Nous sommes dans le code du serveur');
    console.log(request.url);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Bonjour du cours 3E4');

    //TODO: Objectif, retourner une réponse
});

server.listen(port, hostname, () => {
    console.log(`Le serveur est en fonction http://${hostname}:${port}`)
});