# Règles Générales pour les Agents

Ce document définit les règles et standards à suivre pour assurer la cohérence et la qualité du code sur le projet.

## Persona

<PERSONA>
You are Gemini Code Assist, a very experienced and world class software engineering coding assistant.
</PERSONA>

## Objectif

<OBJECTIVE>
Your task is to answer questions and provide insightful answers with code quality and clarity.
Aim to be thorough in your review, and offer code suggestions where improvements in the code can be made, per the input below.
</OBJECTIVE>

## Règles de Communication et de Fichiers

### Gestion des Fichiers

- **Ne pas créer de fichier `.md`** si cela n'est pas explicitement demandé.
- **Placement des fichiers de code** : Les fichiers de code source (`.js`, `.jsx`, `.php`, etc.) doivent impérativement être placés dans leur arborescence projet respective (ex: `src/`, etc.). Ne **jamais** les créer dans le dossier `DEVELOPMENT/`.
- **Création de dossiers et Architecture** : Tu as le droit de modifier l'architecture en ajoutant de nouveaux dossiers si l'implémentation le requiert. **Si tu modifies l'architecture, tu dois impérativement mettre à jour le fichier `DEVELOPMENT/architecture.md`**.
- **Déplacement et suppression** : Si besoin, tu es autorisé à supprimer ou déplacer un fichier pour maintenir l'architecture propre.
- **Modification de fichiers existants** : Tu as le droit de modifier un fichier s'il existe déjà, qu'il soit vide ou non.
- **Doute sur l'emplacement** : Si tu as un doute sur l'emplacement d'un fichier, demande-moi le chemin.
- **Création de dossiers** : Si tu as besoin de créer un dossier n'importe où dans mon architecture, tu peux le faire.

### Mots-clés pour la Portée des Fichiers

Utilisez les mots-clés et la structure de répertoire suivants pour organiser les documents :

- **DEVELOPMENT/** : Ce répertoire est **exclusivement réservé aux fichiers `.md`** de travail destinés aux développeurs (ex: `TODO.md`, `architecture.md`, notes temporaires). Aucun autre type de fichier ne doit y figurer.
- **CONTEXT/** : Ce répertoire est utilisé pour la documentation de fond qui sera utile à d'autres développeurs pour comprendre le projet sur le long terme (ex: spécifications fonctionnelles, diagrammes de haut niveau).

### Gestion des Commits Git

- **Proposition de Commit** : À chaque fois qu'une tâche est terminée, tu dois proposer une commande de commit Git résumant le travail accompli.
- **Format exigé** : La commande doit strictement suivre le format suivant (où `{COMMIT}` est un message concis et descriptif que tu auras généré) : `git add . && git commit -m "{COMMIT}" && git push`
- **Rôle** : Tu dois uniquement proposer cette commande à l'utilisateur (dans un bloc de code). Tu ne dois pas essayer de l'exécuter.

---

# Standards de Développement

## 1. Back-end : Standards Symfony 8 (PHP 8.4+)

Symfony 8 requiert au minimum PHP 8.4. Cette version majeure a nettoyé toutes les couches de dépréciation de la branche 7.x et s'appuie massivement sur les nouvelles fonctionnalités natives de PHP.

### Tableau de bord Symfony 8

| Concept                             | Standard Symfony 8                      | Pratique Obsolète (à bannir)                  |
| :---------------------------------- | :-------------------------------------- | :-------------------------------------------- |
| **Identifiants (Bases de données)** | Auto-incrément (Entiers)               | TOUT TYPE DE UUID (STRICTEMENT INTERDIT)      |
| **Résolution des Types**            | Composant `TypeInfo` stabilisé          | Analyse manuelle ou via Reflection API lourde |
| **Mappage de Données**              | Composant `ObjectMapper` stabilisé      | Sérialiseurs maison complexes                 |
| **Gestion des dates**               | `DatePoint` / `TimePoint` (sans fuseau) | Objets `DateTime` globaux mal gérés           |
| **Lazy Loading**                    | Support natif PHP 8.4 (Lazy Objects)    | Dépendance à `ProxyManager`                   |

### Règles de code Backend

- **Typage Strict Intégral** : L'instruction `declare(strict_types=1);` est obligatoire en haut de chaque fichier. Les types de retour, les types d'arguments et les propriétés typées (`readonly` quand c'est possible) doivent exploiter les nouveautés de PHP 8.4.
- **Attributs PHP exclusifs** : Les annotations (DocBlocks) pour le routage, Doctrine ou la validation sont strictement interdites. Tout se gère via les Attributs PHP (`#[Route]`, `#[ORM\Entity]`).
- **Injection de Dépendances via Constructeur** : L'autowiring de Symfony 8 est extrêmement puissant. Privilégiez l'injection via la promotion de propriétés dans le constructeur (Constructor Property Promotion) pour garder des classes épurées.
- **Commandes Invocables** : La définition des commandes CLI (Console) doit utiliser les structures invocables stabilisées dans Symfony 8, rendant le code plus direct et testable.

## 2. Front-end : Standards React 19

React 19 représente le plus grand changement de paradigme depuis l'introduction des Hooks. L'objectif est l'optimisation par le compilateur et la gestion native de l'asynchrone.

### Tableau de bord React 19

| Concept                   | Standard React 19                     | Pratique Obsolète (à bannir)            |
| :------------------------ | :------------------------------------ | :-------------------------------------- |
| **Mémoïsation**           | Automatique (React Compiler)          | `useMemo`, `useCallback`, `React.memo`  |
| **Références (Refs)**     | Prop standard (`ref={myRef}`)         | `forwardRef`                            |
| **Contextes**             | `<MyContext>`                         | `<MyContext.Provider>`                  |
| **Promesses / Contextes** | Hook `use(Promise)`                   | `useEffect` pour fetcher + State manuel |
| **SEO / Head**            | `<title>`, `<meta>` dans le composant | Librairies tierces comme `react-helmet` |

### Règles de code Frontend

- **JavaScript natif (Pas de TypeScript)** : Le projet est développé exclusivement en JavaScript. Toutes les extensions de fichiers frontend doivent impérativement être `.js` ou `.jsx` (jamais `.ts` ni `.tsx`).
- **Faire confiance au Compilateur (React Compiler)** : Ne polluez plus le code avec des hooks de mémoïsation. Le compilateur analyse les dépendances et gère les re-rendus de manière chirurgicale. Le code doit redevenir simple et lisible.
- **Actions et Formulaires** : Pour toute mutation de donnée (soumission de formulaire, ajout à la collection), utilisez les Actions React avec le hook `useActionState`. L'état de chargement se gère nativement avec `useFormStatus` sans créer de variable d'état `isLoading`.
- **Expérience Utilisateur Optimiste** : Utilisez systématiquement le hook `useOptimistic` lors d'actions utilisateur (comme l'ajout d'un manga à la collection). L'UI doit se mettre à jour instantanément, et React fera le "rollback" en arrière-plan si l'API Symfony renvoie une erreur.
- **L'API `use()` pour la lecture** : Pour consommer un contexte ou lire une promesse de donnée, utilisez la nouvelle API `use()`. Contrairement aux autres hooks, elle peut être appelée de manière conditionnelle (dans un `if`), ce qui simplifie énormément la logique d'affichage.
- **Fonctions de nettoyage dans les Refs** : Les callbacks de `ref` peuvent désormais retourner une fonction de nettoyage. Utilisez ce standard pour détruire proprement l'instance de la caméra (Html5-Qrcode) lorsque le composant de scan est démonté, évitant ainsi les fuites de mémoire.
- **Taille des Composants** : Aucun composant ne doit dépasser **60 lignes**. Découpez la logique en sous-composants dans `src/components/`. Créez des sous-dossiers pour l'organisation si nécessaire, en vérifiant toujours si l'architecture existante n'en possède pas déjà un équivalent.
- **Routage et Écrans** : Tous les écrans doivent être placés dans `src/screens/`. Tout fichier contenant le mot "router" doit être dans `src/router/`.
- **Structure de App.jsx** : `App.jsx` est la vue principale appelée sur tous les écrans, elle doit obligatoirement utiliser le composant `<Outlet />` de React Router.
- **Stockage des Images** : Toutes les images du site doivent être stockées côté Backend dans `www/src/public/Asset/image`. Des sous-dossiers thématiques peuvent être créés si nécessaire, toujours en vérifiant et mettant à jour l'architecture existante.

### Architecture de Dossiers Frontend

````plaintext
src/
├── assets/          # Images, polices, icônes globales
├── components/     # Composants UI atomiques et réutilisables (Max 60 lignes, Boutons, Inputs, Navbar)
|   ├── UI
├── constants/       # toute les constante de l'application et de l'api
├── contexts         # contexte pour l'authentification
├── hooks/           # Hooks personnalisés globaux (useAuth, useLocalStorage)
├── router/          # Fichiers de configuration du routage (contenant "router")
├── screens/         # Écrans de l'application
├── services/        # Logique métier transverse (Analytics, Sentry)
└── store/           # État global (Redux Toolkit, Zustand, Pinia)
---

## 3. Charte Graphique - OmniShelf

### 1. LE CONCEPT VISUEL

OmniShelf se veut être le "hub" ultime de la collection personnelle.
L'identité visuelle doit évoquer la clarté, l'organisation et la passion.
Le logo isométrique suggère la profondeur et l'aspect multidimensionnel de la collection.

### 2. PALETTE DE COULEURS (Basée sur le logo)

L'utilisation de dégradés (gradients) est recommandée pour rappeler l'aspect "tech" et premium.

**A. Couleurs Principales (Brand Colors) :**
- Midnight Navy : `#0A2647` (Le bleu foncé du texte)
- Teal Blue : `#144272` (Transition)
- Cyan Glow : `#205295` (Accents brillants)
- Deep Purple : `#2C016D` (Ombres et profondeur du logo)

**B. Couleurs d'Interface (UI Colors) :**
- Background (Dark Mode) : `#0F172A` (Bleu ardoise très foncé)
- Surface (Cartes/Étagères) : `#1E293B` (Légèrement plus clair pour le relief)
- Text Primary : `#F8FAFC` (Blanc cassé pour la lisibilité)
- Text Secondary : `#94A3B8` (Gris bleuté pour les détails)
- Accent / CTA : `#06B6D4` (Cyan vif pour les boutons d'action)

### 3. TYPOGRAPHIE

La police doit être moderne, géométrique et sans empattement (Sans-serif).

- **Titres (Headings)** : 'Inter' ou 'Montserrat' (Bold/ExtraBold)
  -> Espacement des lettres (letter-spacing) : -0.02em
- **Corps de texte** : 'Inter' or 'Roboto' (Regular/Medium)
  -> Taille de base : 16px

### 4. ÉLÉMENTS GRAPHIQUES & UI

- **Rayons de bordure (Border Radius)** : 12px (pour un look moderne mais structuré).
- **Effets de verre (Glassmorphism)** :
  -> Utiliser 'backdrop-filter: blur(10px)' sur les modales et la barre de navigation.
- **Éléments de collection** : Chaque catégorie (Jeu, Manga, Vinyle, Pop) peut avoir un liseré de couleur subtil :
  * Jeux Vidéo : Cyan
  * Mangas : Indigo
  * Vinyles : Purple
  * Figurines Pop : Teal

### 5. TON DE VOIX

- Professionnel mais passionné.
- Direct ("Ajoutez à votre étagère", "Votre univers en un coup d'œil").

### 6. RECOMMANDATIONS REACT (CSS Variables)

A insérer dans votre fichier `index.css` ou `global.css` :

```css
:root {
  --color-primary: #0A2647;
  --color-secondary: #2C016D;
  --color-accent: #06B6D4;
  --bg-main: #0F172A;
  --bg-surface: #1E293B;
  --text-main: #F8FAFC;
  --text-dim: #94A3B8;
  --gradient-brand: linear-gradient(135deg, #0A2647 0%, #2C016D 100%);
  --shadow-soft: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}
```

---

## 4. Back-end : Architecture et Bonnes Pratiques (Symfony 8)

### Séparation des Responsabilités (Entities vs DTOs)
- **Protection des données** : Ne jamais exposer directement une entité Doctrine complexe à l'API si elle contient des données sensibles ou des relations lourdes.
- **DTOs** : Utiliser systématiquement des objets de transfert de données (*Data Transfer Objects*) couplés au composant `ObjectMapper` ou aux State Providers/Processors d'API Platform pour gérer les requêtes entrantes (`POST`, `PUT`, `PATCH`) et sortantes.

### Contrôleurs "Maigres" (Thin Controllers)
- **Logique métier** : Les contrôleurs ne doivent contenir aucune logique métier. Leur seul rôle est de réceptionner la requête HTTP, d'appeler un service dédié (situé dans `src/Service/` ou `src/UseCase/`), et de retourner une réponse.

### Gestion des Variables d'Environnement (.env)
- **Secrets** : Aucune clé d'API tierce (Google Books, IGDB, Discogs) ou mot de passe de base de données ne doit apparaître en clair dans le code.
- **Injection** : Ces valeurs doivent être injectées via des variables d'environnement (`$_ENV`) et validées au démarrage de l'application via les attributs d'injection de configuration.

### Qualité du Code et Formatage (PER Coding Style)
- **Standards** : Le code PHP doit strictement respecter le standard *PER Coding Style* (qui remplace le PSR-12).
- **Natif** : Utiliser les fonctions natives de PHP plutôt que des surcouches (ex: `str_contains()` plutôt que des Regex complexes si ce n'est pas nécessaire).

### Sécurité et Authentification
- **Protection** : Toutes les routes (hors création de compte et login) doivent être protégées par une vérification de token JWT.
- **Voters** : Vérifier systématiquement l'appartenance des ressources : un utilisateur A ne peut pas modifier, supprimer ou voir un `CollectionItem` appartenant à un utilisateur B (*Voter Symfony* ou restriction API Platform).

## 5. Front-end : Gestion des Données et UI (React 19)

### Appels API et React Query (TanStack Query)
- **Isolation** : Aucun fetch ou axios direct dans les composants UI. Tous les appels réseaux doivent être encapsulés dans des fonctions isolées dans le dossier `src/services/api/`.
- **Consommation** : Ces fonctions sont ensuite consommées via les hooks de React Query (pour le cache, la déduplication et l'invalidation automatique lors d'une mutation).

### Gestion du State Global (Zustand)
- **Portée** : Le store global ne doit stocker que l'état de l'application (Theme Mode, User Token, Modal Open/Close).
- **Pas de doublons** : Ne pas utiliser Zustand pour stocker les données de l'API (cela fait doublon avec React Query).
- **Slices** : Découper le store en "Slices" (ex: `createAuthSlice`, `createThemeSlice`) pour éviter d'avoir un fichier store gigantesque.

### Stylisation avec Tailwind CSS
- **Zéro CSS externe** : Pas de fichiers CSS externes (sauf le `global.css` pour les variables de la charte graphique).
- **Ordre des classes** : Layout (flex, grid) > Spacing (p, m) > Typography (text, font) > Visuals (bg, border) > States (hover, focus).
- **Utilitaire** : Utiliser les packages `clsx` et `tailwind-merge` (`twMerge`) pour gérer dynamiquement les classes sans conflit.

### Suspense et Error Boundaries
- **Chargement** : Puisque l'API `use()` de React 19 met le composant en pause, chaque écran ou section doit être encapsulé dans un `<Suspense fallback={<Loader />}>`.
- **Résilience** : Prévoir des composants `<ErrorBoundary>` globaux pour intercepter les plantages d'interface.

### Props et Valeurs par défaut
- **Validation** : Puisque le projet est en JavaScript, la validation des props se fait via des paramètres par défaut ES6 directement dans la déstructuration : `const MonComposant = ({ title = "Sans titre", isActive = false }) => { ... };`.

## 6. Communication Client-Serveur (API)

### Format de Nommage JSON
- **CamelCase** : Les clés JSON renvoyées par Symfony et lues par React doivent toujours être formatées en `camelCase` (ex: `externalProductId`) pour correspondre aux standards JavaScript.

### Pagination Obligatoire
- **Performance** : Toute route retournant une liste d'éléments doit être paginée côté serveur et côté client pour éviter la surcharge de la mémoire locale ou de la base de données.
