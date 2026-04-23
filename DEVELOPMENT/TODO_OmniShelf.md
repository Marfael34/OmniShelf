# TODO List - OmniShelf 🚀

Ce document suit l'avancement du projet par rapport au cahier des charges et aux standards techniques.

## 🔴 Priorités Immédiates (Stabilité & Standards)
- [x] **Error Boundaries & Suspense** : Encapsuler les routes dans `App.jsx` ou `router.jsx` avec `<Suspense>` et un `<ErrorBoundary>` global (Standard React 19).
- [x] **Optimistic UI** : Implémenter `useOptimistic` pour l'ajout/suppression d'items dans la collection (Standard React 19).
- [x] **Pagination** : Ajouter la pagination sur l'endpoint `/api/proxy/search` et l'UI de recherche (Standard API).
- [x] **Validation des Props** : Passer en revue les composants pour utiliser les valeurs par défaut ES6 au lieu de PropTypes (Standard JS).

## 🟠 Fonctionnalités Core (En cours)
- [x] **Scanner de Code-barres** :
    - [x] Tester l'API Torch (flash) sur mobile.
    - [x] Ajouter le feedback haptique (`navigator.vibrate`) lors d'un scan réussi.
    - [x] Gérer le cas "EAN Inconnu" avec une redirection vers un ajout manuel ou message d'erreur gracieux.
- [x] **Moteur de Recommandation** :
    - [x] Vérifier/Optimiser la logique backend pour agréger les tags des items possédés.
    - [x] Implémenter le "Cold Start" (afficher les tendances si la collection est vide).
- [x] **Affiliation Dynamique** : 
    - [x] Valider les tags Amazon/Fnac dans le hook `useAffiliationLink`.
    - [x] Créer le composant `AffiliationButtons` pour une injection dynamique.

## 🟡 PWA & Offline
- [x] **Service Worker** : Vérifier la stratégie de cache `NetworkFirst` pour les items de collection.
- [x] **Manifest** : S'assurer que toutes les icônes (`pwa-192x192.png`, etc.) sont présentes dans `public/`.
- [x] **Offline UX** : Afficher un indicateur "Mode Hors-ligne" si la connexion est perdue (Standard PWA).

## 🟢 Backend & Sécurité
- [ ] **Voters Symfony** : S'assurer qu'un utilisateur ne peut pas voir/modifier la collection d'un autre.
- [ ] **DTOs & ObjectMapper** : Refactoriser les entrées/sorties de `ProxyController` pour utiliser des DTOs au lieu de tableaux associatifs bruts (Standard Symfony 8).
- [ ] **UUID v7** : Vérifier que les nouvelles entités utilisent bien des UUID v7.

## ✅ Terminé
- [x] Infrastructure Docker (Apache 8013, MariaDB 3318).
- [x] Configuration du Proxy Vite pour éviter les erreurs CORS/502.
- [x] Correction du routage Apache (`.htaccess`).
- [x] Authentification JWT (Login/Register).
- [x] Migration de base vers Tailwind v4 (Tokens `accent`, `main`, `surface`).
- [x] Écrans de détails (Game, Manga, Vinyl, Pop).
- [x] Proxy API unifié (Google Books, RAWG, Discogs).
