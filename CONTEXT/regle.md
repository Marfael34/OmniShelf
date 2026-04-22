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
| **Identifiants (Bases de données)** | UuidV7 (Triable temporellement)         | Auto-incrément classique ou UuidV4            |
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
