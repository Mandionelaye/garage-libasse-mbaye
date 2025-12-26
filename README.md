# Application SaaS de Facturation - Garage Libasse Mbaye

Application web moderne de gestion de factures développée avec React, Firebase et Tailwind CSS.

## 🚀 Fonctionnalités

### Dashboard (Tableau de bord)
- **Statistiques globales** : Nombre total de clients, nombre de factures émises, somme totale encaissée
- **Filtrage par date** : Sélecteurs de date de début et fin pour mise à jour en temps réel
- **Liste des dernières factures** avec option de prévisualisation

### Gestion des Factures
- **Formulaire de création** : Numéro de facture, Date, Nom du client
- **Tableau dynamique** : Quantité (QTE), Désignation, Prix Unitaire (PRIX UNIT), calcul automatique du Montant
- **Champs spécifiques** : Frais de livraison, Main d'œuvre
- **Calcul automatique** du TOTAL final en CFA
- **Stockage** dans Firebase Firestore

### Génération PDF
- Utilisation de **@react-pdf/renderer**
- Design fidèle au modèle original (Garage Libasse Mbaye)
- En-tête avec arc de cercle "FULL SERVICE & REPAIR"
- Logo et coordonnées téléphoniques
- Mention "Le paiement est effectué en espèces"

## 🛠️ Architecture Technique

### Frontend
- **React 18** avec Vite
- **Tailwind CSS** pour le styling
- **TypeScript** pour la sécurité des types
- **React Router** pour la navigation
- **React Hook Form** pour la gestion des formulaires
- **Context API** pour l'état global

### Backend
- **Firebase Firestore** pour la base de données NoSQL
- **Firebase Authentication** pour l'authentification
- **Firebase Storage** pour le stockage des logos

### PDF Generation
- **@react-pdf/renderer** pour la génération côté client
- **React PDF components** pour le layout

### Déploiement
- **Vercel** pour le déploiement automatique
- **CI/CD** avec GitHub Actions

## 📁 Structure du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── Dashboard/       # Composants du tableau de bord
│   ├── Invoices/        # Composants de gestion des factures
│   ├── PDF/             # Composants PDF
│   └── UI/              # Composants d'interface génériques
├── pages/               # Pages de l'application
│   ├── Dashboard.tsx    # Page principale du dashboard
│   ├── Invoices.tsx     # Page de liste des factures
│   ├── CreateInvoice.tsx # Page de création de facture
│   └── ViewInvoice.tsx  # Page de visualisation
├── hooks/               # Custom hooks React
├── utils/               # Fonctions utilitaires
├── contexts/            # Contexts React pour l'état global
├── styles/              # Styles globaux et thèmes
└── App.tsx              # Composant principal
```

## 🗄️ Schéma de Base de Données

### Collection: `invoices`
```typescript
{
  id: string,
  invoiceNumber: string,
  date: Timestamp,
  clientName: string,
  items: Array<{
    quantity: number,
    designation: string,
    unitPrice: number,
    amount: number
  }>,
  deliveryFees: number,
  laborCost: number,
  subtotal: number,
  total: number,
  totalInWords: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `clients`
```typescript
{
  id: string,
  name: string,
  phone: string,
  email: string,
  address: string,
  totalInvoices: number,
  totalAmount: number,
  createdAt: Timestamp
}
```

## 🎨 Design System

### Couleurs
- **Primaire**: Noir (#000000)
- **Secondaire**: Blanc (#FFFFFF)
- **Accent**: Gris (#6B7280)
- **Succès**: Vert (#10B981)
- **Erreur**: Rouge (#EF4444)

### Typographie
- **Police principale**: Inter
- **Police secondaire**: JetBrains Mono (pour les montants)

### Composants
- **Buttons**: Variants primaire, secondaire, outline
- **Cards**: Ombres subtiles, bordures arrondies
- **Forms**: Inputs avec labels animés
- **Tables**: Alternance de lignes, hover states

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/your-username/saas-invoicing-app.git
cd saas-invoicing-app

# Installer les dépendances
npm install

# Configurer Firebase
cp .env.example .env
# Remplir les variables d'environnement Firebase

# Lancer le serveur de développement
npm run dev
```

## 📦 Scripts

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Lance ESLint
- `npm run test` - Lance les tests

## 🔧 Configuration Firebase

### Variables d'environnement requises:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📱 Fonctionnalités Avancées

### Authentification
- Login avec email/mot de passe
- Protection des routes privées
- Gestion des sessions

### Export et Import
- Export PDF des factures
- Export CSV des données
- Import de clients par CSV

### Recherche et Filtrage
- Recherche par client ou numéro de facture
- Filtrage par date, montant, statut
- Tri des colonnes

### Statistiques Avancées
- Graphiques d'évolution mensuelle
- Top clients par chiffre d'affaires
- Taux de croissance

## 🎯 Roadmap

- [ ] Intégration Stripe pour paiements en ligne
- [ ] Envoi automatique par email
- [ ] Gestion des devis
- [ ] Application mobile React Native
- [ ] API REST pour intégrations tierces

## 📄 License

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - Développeur principal
- **Garage Libasse Mbaye** - Client et inspiration du design

## 🙏 Remerciements

- React.js Community
- Firebase Team
- Tailwind CSS Team
- @react-pdf/renderer Contributors