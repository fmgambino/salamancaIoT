// servidor.js
const express = require('express');
const http = require('http');
const app = express();
const port = 3000;

let relayStates = {}; // Guarda el estado de los interruptores

app.use(express.static('public')); // Sirve archivos estáticos

app.get('/relayStates', (req, res) => {
    res.json(relayStates);
});

app.get('/relay', (req, res) => {
    const relayId = req.query.relay;
    const state = req.query.state;
    relayStates[relayId] = state;
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
