# OmniShelf - To-Do List : Écrans & Navigation

Ce document liste les tâches nécessaires pour finaliser l'interface utilisateur (UI), la navigation et le système de recherche globale.

## 1. Routage & Navigation

- [ ] **Router** (dans `src/router/router.jsx`) :
  - Configurer les routes en utilisant ce modèle d'objet pour les liens :
    ```javascript
    {
        path: "/", // chemin de la vue
        element: <Home/>, // élément retourné
    }
    ```
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

## 3. Vues Détaillées par Catégorie

_Note : Chaque vue détaillée doit inclure les boutons d'action "Ajouter à la collection" et "Ajouter à la wishlist"._

- [ ] **Jeu Vidéo** : Titre, Genre, Nom de l'éditeur, Image, PEGI, et lien d'achat.
- [ ] **Manga** : Titre, Nom de l'auteur, Genre, Maison d'édition, Image, et lien d'achat.
- [ ] **Vinyle** : Titre, Nom de l'artiste, Genre, Image, et tracklist (liste des chansons, si disponible).
- [ ] **Figurine POP** : Numéro de la POP, Nom de la série, Nom du personnage, Image.

## 4. Wishlist Commune

- [ ] **Page Wishlist** (`Wishlist.jsx`) :
  - Afficher une liste de souhaits globale regroupant toutes les thématiques.
  - Intégrer un système de filtres pour rechercher/trier facilement par catégorie ou thématique.

## 5. Fonctionnalité de Recherche

- [ ] **Système de Recherche Avancée** :
  - Créer une barre de recherche (soit dans la NavBar, soit sur une page dédiée).
  - Permettre une recherche multicritères : Titre, Nom d'auteur, Maison d'édition, Nom du studio, PEGI.
  - Afficher les résultats sous forme de grille de cartes.
