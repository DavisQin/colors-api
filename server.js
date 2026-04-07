'use strict';
const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory state
/** @type {{name:string, hex:string}[]} */
const colors = [
    { name: 'red', hex: '#ff0000' },
    { name: 'green', hex: '#00ff00' },
    { name: 'blue', hex: '#0000ff' }
];

// TODO: routes go here...

app.listen(PORT, () => {
    console.log(`Colors API listening on http://localhost:${PORT}`);
});