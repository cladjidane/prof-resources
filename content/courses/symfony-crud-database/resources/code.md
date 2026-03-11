# Symfony - CRUD et base de données

## Objectif

Créer une application de gestion de **produits** avec les 4 opérations de base : Créer, Lire, Modifier, Supprimer (CRUD). On utilise le générateur `make:crud` de Symfony qui fait le gros du travail.

On utilise SQLite comme base de données (pas besoin d'installer MySQL ou PostgreSQL).

## Étape 1 : Configurer la base de données SQLite

Dans le fichier `.env`, remplacer la ligne `DATABASE_URL` par :

```bash
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data_%kernel.environment%.db"
```

Puis créer la base :

```bash
symfony console doctrine:database:create
```

## Étape 2 : Créer l'entité Product

L'entité est la classe PHP qui représente une table en base de données.

```bash
symfony console make:entity Product
```

Répondre aux questions du générateur :

```
 New property name > name
 Field type > string
 Field length > 255
 Can this field be null > no

 New property name > price
 Field type > float
 Can this field be null > no

 New property name > description
 Field type > text
 Can this field be null > yes

 New property name >
 (appuyer sur Entrée pour terminer)
```

Le fichier généré :

**src/Entity/Product.php**

```php
<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }
}
```

Chaque propriété avec `#[ORM\Column]` correspond à une colonne en base de données. Les getters/setters sont générés automatiquement.

## Étape 3 : Créer la table en base

```bash
# Générer le fichier de migration (le SQL pour créer la table)
symfony console make:migration

# Exécuter la migration
symfony console doctrine:migrations:migrate
```

Répondre `yes` quand Symfony demande confirmation.

## Étape 4 : Générer le CRUD complet

C'est là que la magie opère :

```bash
symfony console make:crud Product
```

Accepter le nom de controller proposé (`ProductController`).

Symfony génère **7 fichiers** d'un coup :

```
created: src/Controller/ProductController.php
created: src/Form/ProductType.php
created: templates/product/_delete_form.html.twig
created: templates/product/_form.html.twig
created: templates/product/edit.html.twig
created: templates/product/index.html.twig
created: templates/product/new.html.twig
created: templates/product/show.html.twig
```

Démarrer le serveur et tester :

```bash
symfony server:start
```

Aller sur `http://localhost:8000/product` pour voir le résultat.

## Ce qui a été généré

### Le Controller

**src/Controller/ProductController.php**

```php
<?php

namespace App\Controller;

use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/product')]
final class ProductController extends AbstractController
{
    #[Route(name: 'app_product_index', methods: ['GET'])]
    public function index(ProductRepository $productRepository): Response
    {
        return $this->render('product/index.html.twig', [
            'products' => $productRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_product_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $product = new Product();
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($product);
            $entityManager->flush();

            return $this->redirectToRoute('app_product_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('product/new.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_product_show', methods: ['GET'])]
    public function show(Product $product): Response
    {
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_product_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_product_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('product/edit.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_product_delete', methods: ['POST'])]
    public function delete(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$product->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($product);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_product_index', [], Response::HTTP_SEE_OTHER);
    }
}
```

### Le formulaire

**src/Form/ProductType.php**

```php
<?php

namespace App\Form;

use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('price')
            ->add('description')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
```

Le formulaire est lié à l'entité : chaque `->add()` correspond à une propriété de `Product`. Symfony génère automatiquement les champs HTML adaptés (input text, input number, textarea...).

### Les templates

**templates/product/index.html.twig** (liste)

```twig
{% extends 'base.html.twig' %}

{% block title %}Product index{% endblock %}

{% block body %}
    <h1>Product index</h1>

    <table class="table">
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>actions</th>
            </tr>
        </thead>
        <tbody>
        {% for product in products %}
            <tr>
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.description }}</td>
                <td>
                    <a href="{{ path('app_product_show', {'id': product.id}) }}">show</a>
                    <a href="{{ path('app_product_edit', {'id': product.id}) }}">edit</a>
                </td>
            </tr>
        {% else %}
            <tr>
                <td colspan="5">no records found</td>
            </tr>
        {% endfor %}
        </tbody>
    </table>

    <a href="{{ path('app_product_new') }}">Create new</a>
{% endblock %}
```

**templates/product/show.html.twig** (détail)

```twig
{% extends 'base.html.twig' %}

{% block title %}Product{% endblock %}

{% block body %}
    <h1>Product</h1>

    <table class="table">
        <tbody>
            <tr>
                <th>Id</th>
                <td>{{ product.id }}</td>
            </tr>
            <tr>
                <th>Name</th>
                <td>{{ product.name }}</td>
            </tr>
            <tr>
                <th>Price</th>
                <td>{{ product.price }}</td>
            </tr>
            <tr>
                <th>Description</th>
                <td>{{ product.description }}</td>
            </tr>
        </tbody>
    </table>

    <a href="{{ path('app_product_index') }}">back to list</a>
    <a href="{{ path('app_product_edit', {'id': product.id}) }}">edit</a>

    {{ include('product/_delete_form.html.twig') }}
{% endblock %}
```

**templates/product/new.html.twig** (création)

```twig
{% extends 'base.html.twig' %}

{% block title %}New Product{% endblock %}

{% block body %}
    <h1>Create new Product</h1>

    {{ include('product/_form.html.twig') }}

    <a href="{{ path('app_product_index') }}">back to list</a>
{% endblock %}
```

**templates/product/edit.html.twig** (modification)

```twig
{% extends 'base.html.twig' %}

{% block title %}Edit Product{% endblock %}

{% block body %}
    <h1>Edit Product</h1>

    {{ include('product/_form.html.twig', {'button_label': 'Update'}) }}

    <a href="{{ path('app_product_index') }}">back to list</a>

    {{ include('product/_delete_form.html.twig') }}
{% endblock %}
```

**templates/product/_form.html.twig** (partiel réutilisé par new et edit)

```twig
{{ form_start(form) }}
    {{ form_widget(form) }}
    <button class="btn">{{ button_label|default('Save') }}</button>
{{ form_end(form) }}
```

**templates/product/_delete_form.html.twig** (partiel pour le bouton supprimer)

```twig
<form method="post" action="{{ path('app_product_delete', {'id': product.id}) }}"
      onsubmit="return confirm('Are you sure you want to delete this item?');">
    <input type="hidden" name="_token" value="{{ csrf_token('delete' ~ product.id) }}">
    <button class="btn">Delete</button>
</form>
```

## Les routes du CRUD

| Méthode | URL | Nom | Description |
|---------|-----|-----|-------------|
| GET | `/product` | `app_product_index` | Liste de tous les produits |
| GET/POST | `/product/new` | `app_product_new` | Formulaire de création |
| GET | `/product/{id}` | `app_product_show` | Détail d'un produit |
| GET/POST | `/product/{id}/edit` | `app_product_edit` | Formulaire de modification |
| POST | `/product/{id}` | `app_product_delete` | Supprimer un produit |

Pour vérifier les routes :

```bash
symfony console debug:router
```

## Comprendre le code généré

### Le cycle de vie d'un formulaire

```php
// 1. Créer le formulaire lié à l'entité
$form = $this->createForm(ProductType::class, $product);

// 2. Le formulaire "écoute" la requête HTTP
$form->handleRequest($request);

// 3. Si le formulaire est soumis ET valide → sauvegarder
if ($form->isSubmitted() && $form->isValid()) {
    $entityManager->persist($product);  // Prépare l'INSERT
    $entityManager->flush();            // Exécute le SQL
}
```

### persist() vs flush()

```php
// persist() = "Doctrine, suis cet objet"
// flush() = "Doctrine, exécute tous les SQL en attente"

// Créer : persist + flush (nouvel objet, Doctrine ne le connaît pas encore)
$entityManager->persist($product);
$entityManager->flush();

// Modifier : flush suffit (Doctrine suit déjà l'objet chargé depuis la BDD)
$product->setName('Nouveau nom');
$entityManager->flush();

// Supprimer : remove + flush
$entityManager->remove($product);
$entityManager->flush();
```

### Le ParamConverter (automatique)

```php
// Symfony convertit automatiquement {id} en objet Product
#[Route('/{id}')]
public function show(Product $product): Response
{
    // Pas besoin de : $repository->find($id)
    // Si l'id n'existe pas → 404 automatique
}
```

### La protection CSRF

```php
// Le delete vérifie un token CSRF pour empêcher les suppressions non autorisées
if ($this->isCsrfTokenValid('delete'.$product->getId(), $request->getPayload()->getString('_token'))) {
    $entityManager->remove($product);
}
```

```twig
{# Le token est généré dans le template #}
<input type="hidden" name="_token" value="{{ csrf_token('delete' ~ product.id) }}">
```

## Commandes utiles

```bash
symfony console doctrine:database:create     # Créer la base de données
symfony console make:entity                  # Créer/modifier une entité
symfony console make:migration               # Générer une migration
symfony console doctrine:migrations:migrate  # Exécuter les migrations
symfony console make:crud                    # Générer le CRUD complet
symfony console debug:router                 # Voir toutes les routes
symfony console doctrine:schema:validate     # Vérifier la synchro entité/BDD
```

## Exercices proposés

**Facile** : Ajouter un champ `category` (string) à l'entité Product. Relancer `symfony console make:entity Product` pour ajouter le champ, puis `make:migration` et `doctrine:migrations:migrate`. Ajouter le champ dans `ProductType` et adapter les templates.

**Moyen** : Personnaliser le formulaire dans `ProductType.php` en ajoutant des labels en français et des attributs HTML (placeholder, class CSS). Consulter la doc Symfony sur les Form Types.

**Avancé** : Créer une deuxième entité `Category` avec `make:entity`, puis ajouter une relation ManyToOne dans `Product` (un produit appartient à une catégorie). Relancer `make:crud Category` pour avoir un CRUD de catégories. Adapter le formulaire produit pour afficher un `<select>` avec les catégories.
