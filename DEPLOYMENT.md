# Guide de Déploiement - Application SaaS de Facturation

## 🚀 Déploiement Local

### Prérequis
- Node.js 18+ installé
- npm ou yarn
- Un projet Firebase configuré

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   cd saas-invoicing-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Firebase**
   - Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
   - Activer Firestore Database
   - Activer Authentication (optionnel)
   - Copier la configuration du projet
   - Créer un fichier `.env` basé sur `.env.example`
   - Remplir les variables d'environnement Firebase

4. **Lancer l'application**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration Firebase

### 1. Créer un projet Firebase

1. Rendez-vous sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Créer un projet"
3. Suivez les étapes de configuration

### 2. Activer les services

**Firestore Database:**
1. Dans la console Firebase, allez dans "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Mode de test" pour commencer
4. Sélectionnez votre région

**Firebase Authentication (optionnel):**
1. Allez dans "Authentication"
2. Cliquez sur "Commencer"
3. Activez les méthodes d'authentification souhaitées

### 3. Obtenir la configuration

1. Dans la console Firebase, cliquez sur l'icône d'engrenage (Paramètres du projet)
2. Faites défiler jusqu'à "Vos applications"
3. Sélectionnez votre application web
4. Copiez la configuration Firebase

### 4. Variables d'environnement

Créez un fichier `.env` à la racine du projet:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📊 Structure de la base de données

### Collection: `invoices`

```javascript
{
  id: "auto-generated",
  invoiceNumber: "011",
  date: Timestamp,
  clientName: "OVNES",
  items: [
    {
      quantity: 2,
      designation: "Croix alternateur",
      unitPrice: 17000,
      amount: 34000
    }
  ],
  deliveryFees: 9000,
  laborCost: 10000,
  subtotal: 44000,
  total: 64000,
  totalInWords: "soixante-quatre-mille francs CFA",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🌐 Déploiement Production

### Option 1: Vercel (Recommandé)

1. **Poussez le code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/saas-invoicing-app.git
   git push -u origin main
   ```

2. **Déployez avec Vercel**
   - Rendez-vous sur [vercel.com](https://vercel.com/)
   - Importez votre dépôt GitHub
   - Configurez les variables d'environnement
   - Cliquez sur "Deploy"

### Option 2: Netlify

1. **Build du projet**
   ```bash
   npm run build
   ```

2. **Déployez sur Netlify**
   - Rendez-vous sur [netlify.com](https://netlify.com/)
   - Glissez-déposez le dossier `dist`
   - Configurez les variables d'environnement

### Option 3: Firebase Hosting

1. **Installer Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialiser Firebase**
   ```bash
   firebase init hosting
   ```

3. **Build et déployer**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔐 Sécurité

### Règles Firestore de base

```javascript
// Règles de sécurité Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs peuvent lire toutes les factures
    match /invoices/{invoice} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 Fonctionnalités implémentées

✅ Dashboard avec statistiques
✅ Filtrage par date
✅ Création de factures
✅ Calcul automatique des totaux
✅ Génération PDF
✅ Design responsive
✅ Export PDF fidèle au modèle original

## 🎯 Roadmap

- [ ] Authentification utilisateur
- [ ] Gestion des clients
- [ ] Envoi par email
- [ ] Historique des modifications
- [ ] Statistiques avancées
- [ ] Mode sombre
- [ ] Application mobile

## 🆘 Support

En cas de problème:
1. Vérifiez la configuration Firebase
2. Consultez la console du navigateur (F12)
3. Vérifiez les logs Firebase
4. Contactez l'équipe de développement

## 📄 License

MIT License - Voir [LICENSE](LICENSE)