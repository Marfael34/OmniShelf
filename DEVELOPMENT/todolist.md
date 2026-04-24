# Todo List - OmniShelf

## 🛠 Gestion des Collections
- [ ] **Management des collections** : Interface pour renommer, supprimer ou réorganiser les collections personnalisées.
- [ ] **Nettoyage et Collection par défaut** : 
    - Supprimer les collections tests existantes.
    - S'assurer qu'une collection "Ma Collection" par défaut est toujours présente pour chaque utilisateur.

## 🐞 Bugs et Erreurs API
- [ ] **Correction 404** : `GET /api/users/1/collection_items` (La route a été simplifiée en `/api/collection_items?user=...`, il faut mettre à jour tous les appels frontend).
- [ ] **Correction 422** : `POST /api/user_collections` renvoie "Unprocessable Content". 
    - *Cause probable* : Le DTO `UserCollectionInput` attend un IRI `/api/users/1` mais le format envoyé ou la validation échoue.
- [ ] **Fallback Image intelligent** : Si l'URL d'image fournie par l'API (Steam, Discogs, etc.) est morte, lancer une recherche d'image via l'API Google Images ou un autre service basé sur le titre du produit.

## 🔍 Améliorations Recherche & UX
- [ ] **Filtrage par Thématique (Tendances)** : Cliquer sur un badge de thématique (ex: "Espace", "Cyberpunk") dans la section tendances doit filtrer instantanément les résultats de recherche.
- [ ] **Tri des résultats** :
    - Implémenter le tri alphabétique par défaut.
    - Ajouter un sélecteur de tri (A-Z, Z-A, Date de sortie, Note) dans les filtres de recherche.

## 📜 Règles et Conformité
- [ ] Maintenir la règle des 60 lignes par composant.
- [ ] Utiliser systématiquement des DTOs pour les écritures.
