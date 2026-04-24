# Todo List - OmniShelf

## 🛠 Gestion des Collections
- [x] **Management des collections** : Interface pour renommer, supprimer ou réorganiser les collections personnalisées.
- [x] **Nettoyage et Collection par défaut** : 
    - Supprimer les collections tests existantes.
    - S'assurer qu'une collection "Ma Collection" par défaut est toujours présente pour chaque utilisateur.

## 🐞 Bugs et Erreurs API
- [x] **Correction 404** : `GET /api/users/1/collection_items` (Mise à jour effectuée).
- [x] **Correction 422** : `POST /api/user_collections` (IRI utilisateur ajouté et DTO synchronisé).
- [x] **Fallback Image intelligent** : Implémenté via `SmartImage` et Unsplash.

## 🔍 Améliorations Recherche & UX
- [x] **Filtrage par Thématique (Tendances)** : Implémenté via `ThematicTags`.
- [x] **Tri des résultats** : Implémenté (A-Z par défaut + sélecteur).

## 📜 Règles et Conformité
- [x] Maintenir la règle des 60 lignes par composant.
- [x] Utiliser systématiquement des DTOs pour les écritures.

