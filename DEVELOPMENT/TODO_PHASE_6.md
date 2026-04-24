# Phase 6 : Stabilisation Critique & Finalisation UX

## 6.1. Moteur de Recherche (Précision & Filtrage)
- [x] **Filtrage Mangas Strict** : S'assurer que SEULS les mangas ressortent dans la catégorie "Livres/Mangas" (Effectué via subject:manga + filtrage DTO).
- [x] **Recherche Jeux Vidéo (RAWG)** : Investiguer pourquoi certains titres ne ressortent pas (Ajout de search_precise=true).
- [x] **Recherche Figurines POP** : Passer à l'API **Open Products Facts** et améliorer la recherche par nom, univers et numéro (Implémenté).

## 6.2. Gestion des Collections & Wishlist (Bugs de Mutation)
- [x] **Création de Collection** : Réparer le formulaire de création (Passage en PRE_VALIDATE pour le Subscriber).
- [x] **Ajout Collection Principale** : Debugger l'ajout d'un item sans collection spécifique (Fixé via casting string + UniqueConstraint).
- [x] **Ajout Wishlist** : Fixer le blocage sur l'ajout en wishlist (Effectué).

## 6.3. Interface & Navigation (Polissage)
- [x] **NavBar** : Déplacer le bouton "Accueil" (Effectué).
- [x] **Bouton Retour** : Réparer le bouton "Retour" (Effectué).
- [x] **Affichage des Suggestions** : Mise à jour du service de recommandation (API keys + logs).

## 6.4. Debugging Technique
- [ ] **Monitoring API** : Utiliser les nouveaux logs du `ProxyController` pour identifier les erreurs 500 ou les retours vides.
