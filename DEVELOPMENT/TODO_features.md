# OmniShelf - To-Do List : Intégration & Fonctionnalités (Cahier des charges)

Ce document liste les tâches de développement restantes basées sur les spécifications techniques initiales. L'UI de base étant finalisée, cette phase se concentre sur la logique métier, la PWA et la connexion au Backend.

## 1. Backend (Symfony & BFF Proxy)

- [] **APIs Tierces (Proxy)** :
  - [] Créer la route `GET /api/proxy/search?query={q}&category={cat}` (recherche unifiée).
  - [] Créer la route `GET /api/proxy/details?external_id={id}&category={cat}` (métadonnées complètes).
- [] **Moteur de Recommandation** :
  - [] Implémenter `GET /api/users/{id}/recommendations`.
  - [] Créer l'algorithme d'analyse des tags/genres des éléments de la collection de l'utilisateur.
  - [] Exclure de la liste des recommandations les `external_product_id` déjà possédés.

## 2. Frontend - Scanner EAN-13 (PWA)

- [] **Composant UI du Scanner** :
  - [] Créer un composant avec un "Floating Action Button" (FAB) pour lancer le scan n'importe où.
  - [] Intégrer la librairie `Html5-Qrcode` dans une modale plein écran.
  - [] Gérer l'accès à la caméra (`navigator.mediaDevices.getUserMedia`) et l'API Torch (lampe torche).
  - [] Implémenter un Loader visuel de type "HUD Sci-Fi" superposé à la caméra.
  - [] **Crucial (React 19)** : Détruire proprement l'instance de la caméra dans une fonction de nettoyage du callback `ref` lors du démontage du composant.
- [] **Logique & Feedback** :
  - [] Ajouter un feedback haptique (`navigator.vibrate(200)`) lors d'une détection réussie.
  - [] Interroger l'API `/api/scan/{barcode}` via `useQuery` de TanStack Query à la détection.
  - [] Gérer gracieusement l'erreur 404 (Produit Inconnu) : fermer le loader et proposer une interface "Ajout Manuel".

## 3. Frontend - Affiliation Dynamique

- [] **Hook Personnalisé** :
  - [] Créer le hook `useAffiliationLink(productName, category, fallbackEan)`.
  - [] Implémenter la logique d'URL pour Amazon : `https://www.amazon.fr/s?k=[PRODUIT_ENCODE]&tag=[TAG_AMAZON]`.
  - [] Implémenter la logique d'URL pour la Fnac : `https://www.awin1.com/cread.php?awinmid=[ID]&p=[URL_FNAC_ENCODEE]`.
- [] **Intégration UI** :
  - [] Remplacer les liens statiques des vues détaillées (`GameDetails`, `MangaDetails`, etc.) par les URL générées dynamiquement par ce hook.

## 4. Frontend - PWA & Live Data (TanStack Query)

- [ ] **Stratégie Offline (Workbox)** :
  - [ ] Configurer `vite-plugin-pwa` pour le mode offline partiel.
  - [ ] Mettre en cache la collection de l'utilisateur dans IndexedDB pour un affichage immédiat sans réseau.
- [ ] **Hydratation & Performance** :
  - [ ] Régler le `stale-time` de React Query pour dédupliquer les appels et limiter la charge sur le serveur Symfony BFF.

## 5. QA & Plan de Test

- [ ] Tester le "Cold Start" : s'assurer que des suggestions populaires s'affichent si la collection est vide.
- [ ] Tester la concomitance : scanner rapidement deux fois le même code-barres ne doit pas créer de doublon (tester la contrainte d'unicité côté backend).
- [ ] Vérifier la stricte interdiction de TypeScript et le respect de React Compiler dans les nouveaux fichiers générés.
