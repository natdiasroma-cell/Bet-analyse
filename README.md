# 🎯 Bet Analyse - Sports Betting Analysis App

Application mobile complète d'analyse de paris sportifs basée sur des données en temps réel et des modèles prédictifs avancés.

## 🚀 Caractéristiques

- **Analyse complète** des matchs (football, basketball, tennis, MMA, etc.)
- **Data-driven** : intégration de multiples sources (FootyStats, SofaScore, FlashScore, etc.)
- **Cotes comparées** : oddsportal, Packball, SportyTrader
- **Value bets identification** : détection des paris surcotés
- **Statistiques avancées** : xG, possession, efficacité défensive, etc.
- **Notifications en temps réel** : mises à jour live des matchs
- **Système d'abonnement** : 7.99€/mois, 19.99€/3mois, 150€/an

## 📱 Stack Technologique

### Frontend
- **React Native + Expo** : iOS & Android depuis un seul codebase
- **Redux** : gestion d'état globale
- **TypeScript** : sécurité des types

### Backend
- **Node.js + Express** : serveur API
- **PostgreSQL** : base de données principale
- **Redis** : caching & sessions
- **Bull/BullMQ** : queues pour scraping en arrière-plan
- **Socket.io** : WebSocket pour notifications live

### Data & Scraping
- **Puppeteer/Playwright** : scraping des sites
- **Cheerio** : parsing HTML
- **Axios** : requêtes HTTP
- **APScheduler** : jobs planifiés (Python sidekick)

## 📂 Structure du Projet

```
Bet-analyse/
├── frontend/                 # React Native (Expo)
├── backend/                  # Node.js/Express
├── scrapers/                 # Scripts de scraping
├── docker-compose.yml        # Orchestration services
└── docs/                     # Documentation
```

## 🔧 Installation Rapide

### Prérequis
- Node.js >= 18
- PostgreSQL >= 13
- Redis >= 6
- Docker & Docker Compose (optionnel)

### Setup Frontend
```bash
cd frontend
npm install
npx expo start
```

### Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## 📊 Sources de Données Intégrées

| Sport | Sources | Fréquence |
|-------|---------|-----------|
| **Football** | FootyStats, SofaScore, FlashScore, Packball, SoccerStats | Temps réel |
| **Basketball** | ESPN, SofaScore, FlashScore | Temps réel |
| **Tennis** | Tennis Explorer, FlashScore, SofaScore | Live |
| **MMA** | Sherdog, SofaScore, FlashScore | Live |
| **Cotes** | OddsPortal, SportyTrader, Packball | Temps réel |

## 💳 Modèle d'Abonnement

- **Gratuit** : 3 analyses/jour, cotes basiques
- **Premium** : 7.99€/mois - analyses illimitées, cotes complètes, notifications
- **Premium 3 mois** : 19.99€ (6.63€/mois)
- **Premium Annuel** : 150€ (12.50€/mois) - 37% de réduction

## 🔐 Sécurité & Authentification

- **JWT** pour l'authentification
- **OAuth2** pour connexion Google/Apple
- **Stripe** pour les paiements
- **HTTPS** en production
- **Rate limiting** sur l'API

## 📈 Roadmap

- [x] Structure de base
- [ ] Intégration API FootyStats
- [ ] Scraping SofaScore/FlashScore
- [ ] Moteur d'analyse statistique
- [ ] Frontend MVP
- [ ] Système de paiement
- [ ] Notifications push
- [ ] Machine Learning pour prédictions

## 📝 Documentation

- [Setup Guide](./docs/SETUP.md)
- [API Reference](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Contribution Guidelines](./CONTRIBUTING.md)

## 📧 Contact & Support

Pour questions ou support : support@bet-analyse.com

## ⚠️ Disclaimer

Cette application est à usage **informatif et éducatif uniquement**. Les paris sportifs comportent des risques financiers. Vous êtes responsable de vos décisions de pari.

---

**Licence** : MIT  
**Version** : 1.0.0-alpha
