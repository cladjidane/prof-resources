# TP Symfony - Code à copier

## Étape 1 : Créer le Controller

Commande terminal :

```bash
symfony console make:controller HomeController
```

**src/Controller/HomeController.php**

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig', [
            'site_name' => 'MonSite',
        ]);
    }
}
```

## Étape 2 : Configurer Tailwind (CDN)

**templates/base.html.twig**

```twig
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Bienvenue{% endblock %}</title>

    {# Tailwind CSS via CDN #}
    <script src="https://cdn.tailwindcss.com"></script>

    {% block stylesheets %}{% endblock %}
</head>
<body class="min-h-screen flex flex-col">

    {% block body %}{% endblock %}

    {% block javascripts %}{% endblock %}
</body>
</html>
```

## Étape 3 : Header (partial)

**templates/_partials/_header.html.twig**

```twig
<header class="bg-gray-900 text-white">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">

        {# Logo #}
        <a href="{{ path('app_home') }}" class="text-xl font-bold">
            🏠 {{ site_name }}
        </a>

        {# Menu #}
        <ul class="flex space-x-6">
            <li><a href="#" class="hover:text-blue-400">Accueil</a></li>
            <li><a href="#" class="hover:text-blue-400">Services</a></li>
            <li><a href="#" class="hover:text-blue-400">Contact</a></li>
        </ul>

    </nav>
</header>
```

## Étape 4 : Footer (partial)

**templates/_partials/_footer.html.twig**

```twig
<footer class="bg-gray-800 text-gray-300 mt-auto">
    <div class="container mx-auto px-4 py-6 text-center">
        <p>&copy; {{ "now"|date("Y") }} {{ site_name }} - Tous droits réservés</p>
        <p class="text-sm mt-2">
            Fait avec ❤️ et <span class="text-blue-400">Symfony</span>
        </p>
    </div>
</footer>
```

## Étape 5 : Section Hero

```twig
{# Hero Section #}
<section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
    <div class="container mx-auto px-4 text-center">

        <h1 class="text-5xl font-bold mb-4">
            Bienvenue sur {{ site_name }}
        </h1>

        <p class="text-xl mb-8 text-blue-100">
            Découvrez Symfony avec Tailwind CSS
        </p>

        <a href="#content"
           class="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition">
            Découvrir →
        </a>

    </div>
</section>
```

## Étape 6 : Section Content (3 cards)

```twig
{# Content Section #}
<section id="content" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Nos Services</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

            {# Card 1 #}
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                <div class="text-4xl mb-4">🚀</div>
                <h3 class="text-xl font-semibold mb-2">Rapide</h3>
                <p class="text-gray-600">Performance optimisée pour vos projets.</p>
            </div>

            {# Card 2 #}
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                <div class="text-4xl mb-4">🔒</div>
                <h3 class="text-xl font-semibold mb-2">Sécurisé</h3>
                <p class="text-gray-600">Protection de vos données garantie.</p>
            </div>

            {# Card 3 #}
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                <div class="text-4xl mb-4">💡</div>
                <h3 class="text-xl font-semibold mb-2">Simple</h3>
                <p class="text-gray-600">Prise en main facile et intuitive.</p>
            </div>

        </div>
    </div>
</section>
```

## Étape 7 : Fichier complet assemblé

**templates/home/index.html.twig**

```twig
{% extends 'base.html.twig' %}

{% block title %}Accueil - {{ site_name }}{% endblock %}

{% block body %}

    {# Header #}
    {{ include('_partials/_header.html.twig') }}

    {# Hero Section #}
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-5xl font-bold mb-4">
                Bienvenue sur {{ site_name }}
            </h1>
            <p class="text-xl mb-8 text-blue-100">
                Découvrez Symfony avec Tailwind CSS
            </p>
            <a href="#content"
               class="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition">
                Découvrir →
            </a>
        </div>
    </section>

    {# Content Section #}
    <section id="content" class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Nos Services</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                    <div class="text-4xl mb-4">🚀</div>
                    <h3 class="text-xl font-semibold mb-2">Rapide</h3>
                    <p class="text-gray-600">Performance optimisée pour vos projets.</p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                    <div class="text-4xl mb-4">🔒</div>
                    <h3 class="text-xl font-semibold mb-2">Sécurisé</h3>
                    <p class="text-gray-600">Protection de vos données garantie.</p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                    <div class="text-4xl mb-4">💡</div>
                    <h3 class="text-xl font-semibold mb-2">Simple</h3>
                    <p class="text-gray-600">Prise en main facile et intuitive.</p>
                </div>

            </div>
        </div>
    </section>

    {# Footer #}
    {{ include('_partials/_footer.html.twig') }}

{% endblock %}
```

## Bonus : Partial card réutilisable

**templates/_partials/_card.html.twig**

```twig
<div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
    <div class="text-4xl mb-4">{{ icon }}</div>
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description|default('') }}</p>
</div>
```

Utilisation :

```twig
{{ include('_partials/_card.html.twig', {
    'icon': '🚀',
    'title': 'Rapide',
    'description': 'Performance optimisée.'
}) }}
```

## Commandes utiles

```bash
# Démarrer le serveur
symfony server:start

# Debug des routes
symfony console debug:router

# Vider le cache
symfony console cache:clear
```

## Structure des fichiers

```bash
mon_projet/
├── src/
│   └── Controller/
│       └── HomeController.php
│
└── templates/
    ├── base.html.twig
    ├── _partials/
    │   ├── _header.html.twig
    │   └── _footer.html.twig
    └── home/
        └── index.html.twig
```
