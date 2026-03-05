# Symfony - Créer sa première page

## Étape 1 : Créer le Controller

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

    #[Route('/about', name: 'app_about')]
    public function about(): Response
    {
        return $this->render('home/about.html.twig');
    }

    #[Route('/contact', name: 'app_contact')]
    public function contact(): Response
    {
        return $this->render('home/contact.html.twig');
    }
}
```

## Étape 2 : Routes avec paramètres

**Paramètre simple**

```php
#[Route('/article/{slug}', name: 'app_article')]
public function show(string $slug): Response
{
    // /article/mon-super-article → $slug = "mon-super-article"
    return $this->render('article/show.html.twig', [
        'slug' => $slug,
    ]);
}
```

**Avec valeur par défaut**

```php
#[Route('/page/{page}', name: 'app_page')]
public function list(int $page = 1): Response
{
    // /page → $page = 1
    // /page/3 → $page = 3
}
```

**Avec contrainte (chiffres uniquement)**

```php
#[Route('/user/{id}', name: 'app_user', requirements: ['id' => '\d+'])]
public function user(int $id): Response
{
    // /user/42 → OK
    // /user/abc → 404
}
```

**Restreindre les méthodes HTTP**

```php
// GET uniquement (défaut)
#[Route('/contact', name: 'app_contact')]

// POST uniquement
#[Route('/contact/submit', name: 'app_contact_submit', methods: ['POST'])]

// GET et POST sur la même route
#[Route('/contact', name: 'app_contact', methods: ['GET', 'POST'])]
public function contact(Request $request): Response
{
    if ($request->isMethod('POST')) {
        // Traiter le formulaire
    }
    return $this->render('home/contact.html.twig');
}
```

## Étape 3 : Le layout parent

**templates/base.html.twig**

```twig
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Mon Site{% endblock %}</title>
    {% block stylesheets %}{% endblock %}
</head>
<body>

    {# Navigation commune à toutes les pages #}
    <nav>
        <a href="{{ path('app_home') }}">Accueil</a>
        <a href="{{ path('app_about') }}">À propos</a>
        <a href="{{ path('app_contact') }}">Contact</a>
    </nav>

    {% block body %}{% endblock %}

    <footer>
        <p>&copy; {{ "now"|date("Y") }} MonSite</p>
    </footer>

    {% block javascripts %}{% endblock %}
</body>
</html>
```

## Étape 4 : Les templates enfants

**templates/home/index.html.twig**

```twig
{% extends 'base.html.twig' %}

{% block title %}Accueil - {{ site_name }}{% endblock %}

{% block body %}
    <h1>Bienvenue sur {{ site_name }} !</h1>
    <p>Ceci est ma première page Symfony.</p>
{% endblock %}
```

**templates/home/about.html.twig**

```twig
{% extends 'base.html.twig' %}

{% block title %}À propos{% endblock %}

{% block body %}
    <h1>À propos</h1>
    <p>Page de présentation.</p>
{% endblock %}
```

**templates/home/contact.html.twig**

```twig
{% extends 'base.html.twig' %}

{% block title %}Contact{% endblock %}

{% block body %}
    <h1>Contactez-nous</h1>
    <p>Formulaire de contact à venir.</p>
{% endblock %}
```

## Syntaxe Twig : aide-mémoire

**Affichage et logique**

```twig
{{ variable }}              {# Afficher #}
{% if condition %}...{% endif %}  {# Condition #}
{% for item in items %}...{% endfor %}  {# Boucle #}
{# Ceci est un commentaire #}
```

**Filtres courants**

```twig
{{ name|upper }}            {# JOHN #}
{{ name|lower }}            {# john #}
{{ name|capitalize }}       {# John #}
{{ date|date('d/m/Y') }}   {# 15/01/2026 #}
{{ text|striptags }}        {# Enlève le HTML #}
{{ items|length }}          {# Nombre d'éléments #}
{{ items|join(', ') }}      {# "a, b, c" #}
```

**Fonctions Symfony dans Twig**

```twig
{# Lien vers une route #}
<a href="{{ path('app_home') }}">Accueil</a>

{# Lien avec paramètre #}
<a href="{{ path('app_article', {slug: article.slug}) }}">Lire</a>

{# Fichier statique (CSS, JS, image) #}
<link href="{{ asset('css/style.css') }}" rel="stylesheet">

{# Inclure un template partiel #}
{{ include('_partials/header.html.twig') }}
```

## Méthodes utiles d'AbstractController

```php
// Rendre un template Twig
return $this->render('page.html.twig', ['data' => $value]);

// Rediriger vers une route
return $this->redirectToRoute('app_home');

// Retourner du JSON
return $this->json(['status' => 'ok']);

// Message flash
$this->addFlash('success', 'Bien enregistré !');

// Générer une URL
$url = $this->generateUrl('app_show', ['id' => 1]);
```

## Commandes utiles

```bash
symfony server:start          # Démarrer le serveur
symfony console debug:router  # Voir toutes les routes
symfony console cache:clear   # Vider le cache
symfony console list make     # Voir tous les générateurs
```
