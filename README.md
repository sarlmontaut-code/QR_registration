# Cordeur Express - Formulaire d'Enregistrement

Application web pour permettre aux clients d'un cordeur de tennis de s'enregistrer via un QR Code.

## Fonctionnalités
- Formulaire d'enregistrement (Nom, Prénom, Âge, Téléphone).
- Stockage sécurisé sur MongoDB Atlas.
- Dashboard Admin (discret en bas de page) pour exporter les données en Excel.

## Installation Locale
1. `npm install`
2. Créer un fichier `.env` avec votre `MONGODB_URI`.
3. `npm start`

## Déploiement Cloud
1. Mettre le code sur GitHub.
2. Relier Render au dépôt GitHub.
3. Ajouter la variable d'environnement `MONGODB_URI` sur Render.
