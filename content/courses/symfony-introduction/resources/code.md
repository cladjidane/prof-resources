# Symfony - Introduction

## Installation de Symfony CLI

**Windows (avec Scoop)**

```bash
scoop install symfony-cli
```

**macOS (avec Homebrew)**

```bash
brew install symfony-cli/tap/symfony-cli
```

**Linux**

```bash
curl -sS https://get.symfony.com/cli/installer | bash
```

**Vérifier l'installation**

```bash
symfony check:requirements
```

## Créer un nouveau projet

**Application web complète** (Twig, Doctrine, Security, Forms...)

```bash
symfony new mon_projet --webapp
```

**API / Microservice** (installation minimale)

```bash
symfony new mon_api
```

**Démarrer le serveur**

```bash
cd mon_projet
symfony server:start
```

## Créer un premier contrôleur

**Générer le contrôleur**

```bash
symfony console make:controller HelloController
```

**src/Controller/HelloController.php**

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HelloController extends AbstractController
{
    #[Route('/hello/{name}', name: 'app_hello')]
    public function index(string $name): Response
    {
        return $this->render('hello/index.html.twig', [
            'name' => $name,
        ]);
    }
}
```

## Templates Twig : syntaxe de base

**templates/hello/index.html.twig**

```twig
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Bonjour {{ name }} !</h1>
{% endblock %}
```

**Syntaxe Twig**

```twig
{{ variable }}          {# Afficher une variable #}
{% if condition %}      {# Logique : if, for, block #}
{# Ceci est un commentaire #}
```

**Filtres utiles**

```twig
{{ name|upper }}                       {# JOHN #}
{{ name|lower }}                       {# john #}
{{ date|date('d/m/Y') }}              {# 15/01/2026 #}
{{ price|number_format(2, ',', ' ') }} {# 1 234,56 #}
{{ items|length }}                     {# nombre d'éléments #}
```

## Doctrine ORM : les commandes

```bash
# Configurer la base de données dans .env
# DATABASE_URL="mysql://user:pass@127.0.0.1:3306/ma_base"

# Créer la base de données
symfony console doctrine:database:create

# Créer une entité
symfony console make:entity Product

# Générer la migration
symfony console make:migration

# Exécuter les migrations
symfony console doctrine:migrations:migrate

# Générer un CRUD complet
symfony console make:crud Product
```

## Outils de développement

```bash
# Debug des routes
symfony console debug:router

# Debug du container de services
symfony console debug:container

# Vider le cache
symfony console cache:clear
```

**Debug dans le code PHP**

```php
dump($variable);  // Affiche dans la debug toolbar
dd($variable);    // dump + die (arrête l'exécution)
```

## Structure d'un projet Symfony

```
mon_projet/
├── bin/              # Console Symfony
├── config/           # Configuration YAML
├── public/           # Point d'entrée web (index.php)
├── src/
│   ├── Controller/   # Contrôleurs
│   ├── Entity/       # Entités Doctrine
│   └── Repository/   # Requêtes base de données
├── templates/        # Templates Twig
├── var/              # Cache et logs
├── vendor/           # Dépendances (Composer)
├── .env              # Variables d'environnement
└── composer.json     # Dépendances du projet
```

## Récap des commandes essentielles

```bash
symfony new projet --webapp       # Nouveau projet
symfony server:start              # Serveur local
symfony console make:controller   # Créer un contrôleur
symfony console make:entity       # Créer une entité
symfony console make:migration    # Créer une migration
symfony console make:crud         # Générer un CRUD
symfony console debug:router      # Debug des routes
symfony console cache:clear       # Vider le cache
```
