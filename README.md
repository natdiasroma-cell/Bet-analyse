# Bet-Analyse

Bet-Analyse est une application d'analyse sportive avancée dédiée aux paris sportifs. Cette application combine intelligence artificielle, statistiques avancées, et intégration d'APIs pour fournir des analyses précises et des prédictions sur les événements sportifs.

## Structure du projet

```
Bet-Analyse/
├── app/                # Projet Android Kotlin
├── backend/            # Backend API pour traitements serveurs
├── models/             # Modèles prédictifs et analyses avancées
├── docs/               # Documentation du projet (instructions, vision)
└── README.md           # Aperçu du projet
```

### Prérequis
- Android Studio (pour le développement mobile)
- Node.js (pour le backend)
- Python (pour l'intégration des modèles prédictifs)

---
## Objectifs de développement

### Application Android (Frontend)
- Développement en **Kotlin**
- Utilisation de **Jetpack Compose**
- Intégration des APIs sportives et cotes en temps réel

### Analyse Backend/API
- Développement en Node.js
- Gestion des intégrations (APIs sportives, scraping si nécessaire)

### Modèles prédictifs
- Scripts Python avec librairies telles que scikit-learn, pandas, et numpy
- Intégration des données de performances, historiques, et statistiques avancées

---
# Installation

### 1. Cloner le projet
```bash
git clone https://github.com/natdiasroma-cell/Bet-Analyse.git
```

### 2. Configurer l'environnement Android
Ouvrir le dossier `app/` dans Android Studio pour commencer le développement de l'application native.

### 3. Démarrer le backend
Ouvrir le dossier backend et exécuter :
```bash
npm install
npm start
```

### 4. Générer des analyses (Python)
Aller dans le dossier `models/` et tester les scripts prédictifs avec Python.
```bash
python analysis.py
```