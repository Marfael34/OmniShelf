# OmniShelf - To-Do List : Écrans & Navigation

Ce document liste les tâches nécessaires pour finaliser l'interface utilisateur (UI), la navigation et le système de recherche globale.

## 1. Routage & Navigation

- [ ] **Router** (dans `src/router/AppRouter.jsx`) :
  - Configurer les routes avec `react-router-dom` pour englober toute l'application.
  - Définir les chemins principaux : `/` (Accueil), `/profile` (Profil), `/search` (Recherche), `/collection` (Collection).
- [ ] **NavBar** (dans `src/components/layout/NavBar.jsx`) :
  - Intégrer le logo OmniShelf.
  - Ajouter les liens de navigation.
  - Gérer l'affichage conditionnel : boutons "Connexion / Inscription" (si visiteur) vs bouton "Profil" (si utilisateur connecté via Zustand).

## 2. Écrans Principaux (dans `src/screens/`)

- [ ] **Page d'Accueil** (`Home.jsx`) :
  - Message de bienvenue interactif et présentation globale du site.
  - Créer une section visuelle divisée en 4 catégories, chacune avec un background thématique :
    - 🎮 Jeux Vidéo
    - 📚 Manga
    - 💿 Vinyle
    - 🦸‍♂️ Figurine POP
- [ ] **Page Profil** (`Profile.jsx`) :
  - Afficher les informations du compte de l'utilisateur connecté.
  - Intégrer une vue d'ensemble des différentes collections possédées par l'utilisateur.
- [ ] **Page Mes Collections** (`MyCollections.jsx`) :
  - Afficher uniquement et en détail l'ensemble des collections de l'utilisateur connecté.

## 3. Fonctionnalité de Recherche

- [ ] **Système de Recherche Avancée** :
  - Créer une barre de recherche (soit dans la NavBar, soit sur une page dédiée).
  - Permettre une recherche multicritères : Titre, Nom d'auteur, Maison d'édition, Nom du studio, PEGI.
  - Afficher les résultats sous forme de grille de cartes.
