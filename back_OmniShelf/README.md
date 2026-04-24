# Recipe Docker - Symfony 8

Configuration Docker professionnelle pour un projet Symfony 8 avec Apache, PHP 8.3 et MariaDB.

## 🚀 Stack Technique

- **Framework** : Symfony 8
- **PHP** : 8.4+ avec Apache (mod_rewrite activé)
- **Base de données** : MariaDB 11.3
- **Extensions PHP** : GD, Intl, MySQLi, PDO, PDO_MySQL
- **Outils** : Composer 2, Symfony CLI, Node.js 20 (via NVM), Xdebug

## 📋 Prérequis

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## 🏗️ Structure du Projet

```
.
├── apache/
│   ├── Dockerfile          # Image Apache/PHP personnalisée
│   └── custom-php.ini      # Configuration PHP personnalisée
├── db/
│   ├── backup.sh           # Script de sauvegarde
│   ├── restore.sh          # Script de restauration
│   └── init.sql            # Scripts SQL d'initialisation
├── www/                    # Code source de l'application
├── docker-compose.yml      # Configuration Docker Compose
├── .dockerignore           # Fichiers exclus du build
├── .env.example            # Modèle de configuration (à copier en .env)
├── .env                    # Configuration locale (ignoré par Git)
├── .htaccess              # Configuration Apache
├── aliases.sh             # Aliases pour faciliter l'utilisation
└── README.md              # Ce fichier
```

## 🚦 Démarrage Rapide

### 1. Configuration de l'environnement

**Étape importante** : Créez votre fichier `.env` à partir du modèle `.env.example` :

```bash
# Copier le fichier exemple vers .env
cp .env.example .env

# Éditer le fichier .env selon vos besoins
nano .env
# ou
code .env
```

Le fichier `.env.example` contient toutes les variables nécessaires avec des valeurs par défaut pour le développement. **Modifiez les valeurs selon vos besoins**, notamment :

- `APACHE_PORT` : Port d'Apache (par défaut `8000` si le port 80 est occupé)
- `MYSQL_ROOT_PASSWORD` : Mot de passe root de MariaDB
- `MYSQL_DATABASE` : Nom de votre base de données
- `MYSQL_USER` : Utilisateur de l'application
- `MYSQL_PASSWORD` : Mot de passe de l'utilisateur

**⚠️ Important** : Le fichier `.env` est automatiquement ignoré par Git (voir `.gitignore`). Ne commitez **JAMAIS** le fichier `.env` dans Git car il contient des informations sensibles.

**Structure du fichier `.env`** :

```bash
# Configuration Apache / PHP
APACHE_PORT=8000
PHP_ERROR_REPORTING=E_ALL
PHP_DISPLAY_ERRORS=On

# Configuration MariaDB
MARIADB_PORT=3306
MYSQL_ROOT_PASSWORD=changez_moi_en_production
MYSQL_DATABASE=nom_de_votre_bdd
MYSQL_USER=utilisateur_bdd
MYSQL_PASSWORD=changez_moi_en_production
MYSQL_ROOT_HOST=%

# Noms des containers (pour aliases.sh)
APACHE_CONTAINER=apache_vierge
MARIADB_CONTAINER=mariadb_vierge
```

### 2. Construction et démarrage

```bash
# Construire les images et démarrer les containers
docker compose up -d --build

# Vérifier l'état des containers
docker compose ps

# Voir les logs
docker compose logs -f
```

### 3. Accès aux services

- **Application web** : http://localhost:8000 (ou le port défini dans `.env`)
- **MariaDB** : localhost:3306
  - Utilisateur root : `root` / Mot de passe : défini dans `.env`
  - Utilisateur : défini dans `.env` (par défaut `utilisateur_bdd`)

**Note** : Si le port 80 est déjà utilisé (par exemple par Traefik), le port par défaut est `8000`. Vous pouvez le modifier dans votre fichier `.env`.

## 🎯 Configuration Symfony 8

### Installation d'un nouveau projet

Si vous n'avez pas encore de projet Symfony :

```bash
# Entrer dans le container Apache
capache

# Créer un nouveau projet Symfony 8 directement dans www
cd /var/www/html
composer create-project symfony/skeleton:"8.0.x" ./

# Installer les dépendances supplémentaires
composer require symfony/orm-pack
composer require symfony/maker-bundle --dev
```

### Structure recommandée pour Symfony

```
www/
├── public/
│   └── index.php           # Point d'entrée de l'application
├── src/
│   ├── Controller/
│   ├── Entity/
│   ├── Repository/
│   └── ...
├── templates/
├── migrations/
├── config/
│   ├── packages/
│   └── routes.yaml
├── .env                    # Variables d'environnement (à modifier)
├── .env.local              # Variables locales (ignoré par Git)
├── composer.json
└── symfony.lock
```

### Configuration `.env` pour Symfony

Modifiez les variables dans votre `.env` :

```env
# .env
APP_ENV=dev
APP_DEBUG=true
APP_SECRET=ChangeMe

# Database Configuration
DATABASE_URL="mysql://utilisateur_bdd:changez_moi_en_production@mariadb:3306/nom_de_votre_bdd?serverVersion=11.3-MariaDB&charset=utf8mb4"

# Mailer Configuration
MAILER_DSN=null://null
```

### Initialisation de la base de données

```bash
# Entrer dans le container
capache

# Créer la base de données
cconsole doctrine:database:create

# Générer et exécuter les migrations
cconsole make:migration
cconsole doctrine:migrations:migrate
```

**Ou sans alias :**

```bash
# Créer la base de données
docker compose exec apache_vierge php bin/console doctrine:database:create

# Générer et exécuter les migrations
docker compose exec apache_vierge php bin/console make:migration
docker compose exec apache_vierge php bin/console doctrine:migrations:migrate
```

### Développement avec Symfony

```bash
# Créer une entité
cconsole make:entity

# Créer un contrôleur
cconsole make:controller NomDuController

# Générer un formulaire
cconsole make:form

# Lancer les tests
composer test

# Débogage avec Symfony profiler
# Accéder à /_profiler pour analyser les requêtes
```

**Ou sans alias :**

```bash
# Créer une entité
docker compose exec apache_vierge php bin/console make:entity

# Créer un contrôleur
docker compose exec apache_vierge php bin/console make:controller NomDuController

# Générer un formulaire
docker compose exec apache_vierge php bin/console make:form

# Lancer les tests
docker compose exec apache_vierge composer test

# Débogage avec Symfony profiler
# Accéder à /_profiler pour analyser les requêtes
```

**Note** : `.env.local` est ignoré par Git. Utilisez-le pour vos configurations spécifiques locales.



### Charger les aliases

```bash
source aliases.sh
```

### Commandes utiles

#### Avec les aliases (plus rapide)

```bash
# Composer (installation de dépendances)
ccomposer install
ccomposer require symfony/orm-pack

# Symfony Console
cconsole cache:clear
cconsole doctrine:migrations:migrate
cconsole doctrine:database:create
cconsole doctrine:schema:update --force

# Accéder aux containers
capache    # Entrer dans le container Apache
cmariadb   # Entrer dans le container MariaDB

# Base de données
db-export  # Sauvegarder la base de données
db-import  # Restaurer la base de données
```

#### Sans aliases (avec docker compose exec)

```bash
# Composer (installation de dépendances)
docker compose exec apache_vierge composer install
docker compose exec apache_vierge composer require symfony/orm-pack

# Symfony Console
docker compose exec apache_vierge php bin/console cache:clear
docker compose exec apache_vierge php bin/console doctrine:migrations:migrate
docker compose exec apache_vierge php bin/console doctrine:database:create
docker compose exec apache_vierge php bin/console doctrine:schema:update --force

# Accéder aux containers
docker compose exec apache_vierge bash     # Entrer dans le container Apache
docker compose exec mariadb_vierge bash    # Entrer dans le container MariaDB

# Base de données
docker compose exec mariadb_vierge /docker-entrypoint-initdb.d/backup.sh   # Sauvegarder
docker compose exec mariadb_vierge /docker-entrypoint-initdb.d/restore.sh  # Restaurer
```

### Commandes Docker Compose

```bash
# Démarrer les services
docker compose up -d

# Arrêter les services
docker compose stop

# Arrêter et supprimer les containers
docker compose down

# Reconstruire les images
docker compose build --no-cache

# Voir les logs
docker compose logs -f apache_vierge
docker compose logs -f mariadb_vierge

# Exécuter une commande dans un container
docker compose exec apache_vierge bash
docker compose exec mariadb_vierge bash
```

## 🔒 Sécurité

### Bonnes pratiques implémentées

✅ **Réseau isolé** : Les services communiquent via un réseau Docker privé  
✅ **Healthchecks** : Vérification automatique de la santé des containers  
✅ **Variables d'environnement** : Mots de passe configurables via `.env`  
✅ **Limites de ressources** : Contrôle de la mémoire et CPU  
✅ **Versions fixées** : Images Docker versionnées pour la reproductibilité  
✅ **.dockerignore** : Exclusion des fichiers inutiles du contexte de build  

### Recommandations de sécurité

1. **Toujours utiliser `.env.example` comme modèle** : Copiez-le en `.env` et modifiez les valeurs
2. **Ne jamais commiter le fichier `.env`** dans Git (déjà configuré dans `.gitignore`)
3. **Utiliser des mots de passe forts** en production
4. **Limiter l'exposition des ports** en production (utiliser un reverse proxy)
5. **Désactiver Xdebug** en production (modifier le Dockerfile)
6. **Vérifier que `.env` est bien ignoré** : `git status` ne doit pas lister `.env`

## 📊 Gestion de la Base de Données

### Sauvegarde

```bash
# Via alias
db-export

# Ou directement
docker compose exec mariadb_vierge /docker-entrypoint-initdb.d/backup.sh
```

Le fichier de sauvegarde sera créé dans `./db/init.sql` sur l'hôte.

### Restauration

```bash
# Via alias
db-import

# Ou directement
docker compose exec mariadb_vierge /docker-entrypoint-initdb.d/restore.sh
```

### Scripts SQL d'initialisation

Placez vos scripts SQL dans le dossier `./db/`. Ils seront automatiquement exécutés au premier démarrage de MariaDB.

## 🐛 Débogage avec Xdebug

Xdebug est installé et configuré. Pour l'utiliser avec VSCode :

1. Décommentez les lignes dans `apache/custom-php.ini` :
```ini
xdebug.client_host = host.docker.internal
xdebug.client_port = 9003
xdebug.start_with_request = yes
xdebug.idekey = VSCODE
```

2. Configurez VSCode avec `.vscode/launch.json` :
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "pathMappings": {
        "/var/www/html": "${workspaceFolder}/www"
      }
    }
  ]
}
```

## ⚙️ Configuration PHP

Le fichier `apache/custom-php.ini` contient les paramètres personnalisés :

- Limites d'upload : 100M
- Mémoire : 256M
- Timeout d'exécution : 300s
- Timezone : Europe/Paris

Modifiez selon vos besoins.

## 🔧 Optimisations

### Build optimisé

- **Couches Docker réduites** : RUN combinés pour réduire la taille de l'image
- **Cache apt nettoyé** : Réduction de la taille finale
- **Compilation parallèle** : Utilisation de `-j$(nproc)` pour les extensions PHP
- **.dockerignore** : Exclusion des fichiers inutiles

### Performance

- **Healthchecks** : Détection rapide des problèmes
- **Limites de ressources** : Contrôle de la consommation
- **Réseau isolé** : Communication optimisée entre services

## 📝 Notes de Production

Avant de déployer en production :

1. **Desactiver le mode debug** :
   ```env
   APP_ENV=prod
   APP_DEBUG=false
   ```

2. **Générer une clé secrète unique** :
   ```bash
   cconsole secrets:generate-keys
   ```

3. **Désactiver Xdebug** dans le Dockerfile

4. **Modifier les variables PHP** : `PHP_DISPLAY_ERRORS=Off`

5. **Utiliser un reverse proxy** (Nginx/Traefik) au lieu d'exposer directement le port 80

6. **Configurer des sauvegardes automatiques** de la base de données

7. **Mettre en place la surveillance** (logs, métriques)

8. **Utiliser HTTPS** avec un certificat SSL

9. **Optimiser le cache Symfony** :
   ```bash
   cconsole cache:warmup
   ```

10. **Vérifier les permissions des fichiers** :
    ```bash
    docker compose exec apache_vierge chown -R www-data:www-data /var/www/html
    docker compose exec apache_vierge chmod -R 755 /var/www/html
    ```

## 🆘 Dépannage

### Le container Apache ne démarre pas

```bash
# Vérifier les logs
docker compose logs apache_vierge

# Vérifier que le dossier www existe
ls -la www/
```

### La base de données n'est pas accessible

```bash
# Vérifier que MariaDB est healthy
docker compose ps

# Vérifier les logs
docker compose logs mariadb_vierge

# Tester la connexion
docker compose exec mariadb_vierge mariadb -uroot -p
```

### Problèmes de permissions

```bash
# Vérifier les permissions du dossier www
ls -la www/

# Si nécessaire, corriger les permissions dans le container
docker compose exec apache_vierge chown -R www-data:www-data /var/www/html
```

### Erreur "Forbidden" ou "403"

Si vous voyez une erreur "Forbidden" lors de l'accès à l'application :

1. **Vérifier qu'un fichier `index.php` existe** dans `www/public/` :
```bash
ls -la www/public/index.php
```

2. **Créer un fichier index.php de test** si nécessaire :
```bash
echo "<?php phpinfo(); ?>" > www/public/index.php
```

3. **Vérifier les permissions** dans le container :
```bash
docker compose exec apache_vierge chown -R www-data:www-data /var/www/html
docker compose exec apache_vierge chmod -R 755 /var/www/html
```

### Port déjà utilisé

Si vous obtenez l'erreur "port is already allocated" :

1. **Identifier quel service utilise le port** :
```bash
docker ps | grep :80
# ou
sudo lsof -i :80
```

2. **Changer le port dans `.env`** :
```bash
# Éditer .env et modifier APACHE_PORT
APACHE_PORT=8000  # ou tout autre port libre
```

3. **Redémarrer les containers** :
```bash
docker compose down && docker compose up -d
```

### Problèmes spécifiques à Symfony

#### Erreur "No route found"

Si vous obtenez une erreur 404 "No route found" :

1. **Vérifier que le fichier `.htaccess` existe** et que `mod_rewrite` est actif :
```bash
docker compose exec apache_vierge a2enmod rewrite
```

2. **Vérifier les routes configurées** :
```bash
cconsole debug:router
```

3. **Vérifier le fichier `.env`** et la configuration de l'application

#### Erreur Doctrine/Base de données

Si vous avez une erreur concernant la base de données :

```bash
# Vérifier la connexion
cconsole dbal:run-sql "SELECT 1"

# Créer la base de données
cconsole doctrine:database:create

# Exécuter les migrations
cconsole doctrine:migrations:migrate
```

**Ou sans alias :**

```bash
# Vérifier la connexion
docker compose exec apache_vierge php bin/console dbal:run-sql "SELECT 1"

# Créer la base de données
docker compose exec apache_vierge php bin/console doctrine:database:create

# Exécuter les migrations
docker compose exec apache_vierge php bin/console doctrine:migrations:migrate
```

#### Cache Symfony

Si le cache pose problème :

```bash
# Vider le cache complètement
cconsole cache:clear --no-warmup

# Reconstruire le cache
cconsole cache:warmup
```

**Ou sans alias :**

```bash
# Vider le cache complètement
docker compose exec apache_vierge php bin/console cache:clear --no-warmup

# Reconstruire le cache
docker compose exec apache_vierge php bin/console cache:warmup
```



## 📚 Ressources

- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Documentation PHP](https://www.php.net/docs.php)
- [Documentation MariaDB](https://mariadb.com/docs/)

## 📄 Licence

Ce template est fourni tel quel pour vos projets.

---

## 🎮 API Proxy IGDB

Le backend sert de proxy pour l'API IGDB afin de protéger les clés API et de normaliser les réponses pour le frontend.

### Endpoints
- `GET /api/proxy/igdb/search?query=...` : Recherche de jeux sur IGDB.
- `GET /api/proxy/igdb/details?external_id=...` : Détails complets d'un jeu.
- `GET /api/proxy/search?query=...&category=game` : Recherche générique (orchestrée par `ProxyService`).
- `GET /api/proxy/details?external_id=...&category=game` : Détails génériques.

### Configuration
Assurez-vous que les variables suivantes sont définies dans votre `.env` (dans `www/`) :
```env
IGDB_CLIENT_ID=votre_client_id
IGDB_CLIENT_SECRET=votre_client_secret
```

---

**Créé avec ❤️ pour Symfony 8**

