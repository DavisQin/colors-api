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
const HEX_RE = /^#?[0-9a-fA-F]{6}$/;

function isValidHex(input) {
    return typeof input === 'string' && HEX_RE.test(input);
}

function normalizeHex(input) {
    const raw = input.startsWith('#') ? input.slice(1) : input;
    return `#${raw.toLowerCase()}`;
}

function normalizeName(name) {
    return String(name || '').toLowerCase().trim();
}

function findIndexByName(name) {
    const n = normalizeName(name);
    return colors.findIndex(c => c.name === n);
}

app.listen(PORT, () => {
    console.log(`Colors API listening on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.status(200).json(colors);
});

app.head('/', (req, res) => {
    res.set('X-Color-Count', String(colors.length));
    res.sendStatus(200);
});

app.get('/:name', (req, res) => {
    const idx = findIndexByName(req.params.name);
    if (idx === -1) {
        return res.status(404).json({ error: 'not found' });
    }
    res.status(200).json(colors[idx]);
});

app.post('/add', (req, res) => {
    const { name, hex } = req.body || {};

    const nName = normalizeName(name);
    if (!nName) {
        return res.status(400).json({ error: 'name is required' });
    }

    if (!isValidHex(hex)) {
        return res.status(400).json({ error: 'hex must be 6 hex digits, with or without leading #' });
    }

    if (findIndexByName(nName) !== -1) {
        return res.status(409).json({ error: 'color already exists' });
    }

    const nHex = normalizeHex(hex);
    const created = { name: nName, hex: nHex };
    colors.push(created);
    return res.status(201).json(created);
});

app.delete('/:name', (req, res) => {
    const idx = findIndexByName(req.params.name);
    if (idx === -1) {
        return res.status(404).json({ error: 'not found' });
    }
    colors.splice(idx, 1);
    return res.sendStatus(204);
});