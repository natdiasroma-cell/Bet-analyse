// Fichier de base pour le Backend/API
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Backend Bet-Analyse en cours de configuration...');
});

app.listen(port, () => {
  console.log(`Backend en écoute sur le port ${port}`);
});