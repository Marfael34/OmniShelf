# TODO - Correctifs & Nouvelles Fonctionnalités 🛠️

## 🔴 Bugs Prioritaires
- [x] **Inscription & Rôles** : Rôle `ROLE_USER` ajouté par défaut dans le constructeur de l'entité `User`.
- [x] **Type d'ID Utilisateur & Collection** : Passage en type `int` auto-incrémenté pour `User` et `UserCollection` (préparation des migrations en cours).
- [ ] **Recherche de Jeux** : Ajout d'un `User-Agent` dans `ProxyService.php` pour éviter le blocage par RAWG. (Tests en cours, possible blocage IP environnement).

## 🟠 Évolutions Wishlist
- [x] **Wishlist Dynamique** : Écran `Wishlist.jsx` refactorisé avec React Query et filtres API Platform (`isWishlist`).
- [x] **Accès Restreint** : Protection ajoutée via `useAuthStore` et redirection.

## 🟡 Gestion des Collections
- [x] **Multi-Collections** : Entité `UserCollection` créée et liée aux items. UI `MyCollections.jsx` mise à jour pour gérer plusieurs étagères.
- [x] **Accès Restreint** : Sécurisation de l'accès aux collections effectuée.
- [x] **Architecture Backend** : Entité `UserCollection` implémentée.
