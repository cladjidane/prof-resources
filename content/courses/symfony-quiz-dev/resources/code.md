# Quiz Dev - Application Symfony

## Architecture du projet

```
quiz-dev/
├── data/quizzes/           # 6 fichiers YAML (thèmes)
├── src/
│   ├── Controller/
│   │   └── QuizController.php
│   └── Service/
│       └── QuizLoader.php
├── templates/
│   ├── base.html.twig
│   └── quiz/
│       ├── home.html.twig
│       ├── play.html.twig
│       └── score.html.twig
└── assets/controllers/     # Stimulus (timer + quiz)
```

## Configuration du service

**config/services.yaml**

```yaml
parameters:
    app.quiz_directory: '%kernel.project_dir%/data/quizzes'

services:
    App\Service\QuizLoader:
        arguments:
            $quizDirectory: '%app.quiz_directory%'
```

## Le Service QuizLoader

**src/Service/QuizLoader.php**

```php
<?php

namespace App\Service;

use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Finder\Finder;

class QuizLoader
{
    public function __construct(
        private string $quizDirectory,
    ) {}

    public function getThemes(): array
    {
        $themes = [];
        $finder = new Finder();
        $finder->files()->in($this->quizDirectory)->name('*.yaml');

        foreach ($finder as $file) {
            $data = Yaml::parseFile($file->getRealPath());
            $themes[] = [
                'slug' => $file->getFilenameWithoutExtension(),
                'name' => $data['name'],
                'icon' => $data['icon'],
                'count' => count($data['questions']),
            ];
        }

        return $themes;
    }

    public function getQuiz(string $slug): ?array
    {
        $path = $this->quizDirectory . '/' . $slug . '.yaml';
        if (!file_exists($path)) {
            return null;
        }
        return Yaml::parseFile($path);
    }

    public function getRandomQuestions(string $slug, int $count = 10): ?array
    {
        $quiz = $this->getQuiz($slug);
        if (!$quiz) {
            return null;
        }

        $questions = $quiz['questions'];
        shuffle($questions);

        return array_slice($questions, 0, $count);
    }
}
```

## Le Controller

**src/Controller/QuizController.php**

```php
<?php

namespace App\Controller;

use App\Service\QuizLoader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class QuizController extends AbstractController
{
    public function __construct(
        private QuizLoader $quizLoader,
    ) {}

    #[Route('/', name: 'quiz_home')]
    public function home(): Response
    {
        return $this->render('quiz/home.html.twig', [
            'themes' => $this->quizLoader->getThemes(),
        ]);
    }

    #[Route('/quiz/{slug}/start', name: 'quiz_start')]
    public function start(Request $request, string $slug): Response
    {
        $questions = $this->quizLoader->getRandomQuestions($slug);

        if (!$questions) {
            throw $this->createNotFoundException('Quiz introuvable');
        }

        // Stocker l'état du quiz en session
        $session = $request->getSession();
        $session->set('quiz_' . $slug, [
            'questions' => $questions,
            'current' => 0,
            'answers' => [],
            'score' => 0,
        ]);

        return $this->redirectToRoute('quiz_play', ['slug' => $slug]);
    }

    #[Route('/quiz/{slug}/play', name: 'quiz_play')]
    public function play(Request $request, string $slug): Response
    {
        $session = $request->getSession();
        $state = $session->get('quiz_' . $slug);

        if (!$state) {
            return $this->redirectToRoute('quiz_start', ['slug' => $slug]);
        }

        // Quiz terminé ?
        if ($state['current'] >= count($state['questions'])) {
            return $this->redirectToRoute('quiz_score', ['slug' => $slug]);
        }

        $question = $state['questions'][$state['current']];

        return $this->render('quiz/play.html.twig', [
            'question' => $question,
            'current' => $state['current'] + 1,
            'total' => count($state['questions']),
            'slug' => $slug,
        ]);
    }

    #[Route('/quiz/{slug}/answer', name: 'quiz_answer', methods: ['POST'])]
    public function answer(Request $request, string $slug): Response
    {
        $session = $request->getSession();
        $state = $session->get('quiz_' . $slug);

        if (!$state) {
            return $this->redirectToRoute('quiz_home');
        }

        $answerIndex = (int) $request->request->get('answer', -1);
        $question = $state['questions'][$state['current']];
        $isCorrect = $answerIndex === $question['correct'];

        if ($isCorrect) {
            $state['score']++;
        }

        $state['answers'][] = [
            'question' => $question['text'],
            'given' => $answerIndex,
            'correct' => $question['correct'],
            'isCorrect' => $isCorrect,
            'explanation' => $question['explanation'] ?? null,
        ];
        $state['current']++;

        $session->set('quiz_' . $slug, $state);

        return $this->redirectToRoute('quiz_play', ['slug' => $slug]);
    }

    #[Route('/quiz/{slug}/score', name: 'quiz_score')]
    public function score(Request $request, string $slug): Response
    {
        $session = $request->getSession();
        $state = $session->get('quiz_' . $slug);

        if (!$state) {
            return $this->redirectToRoute('quiz_home');
        }

        return $this->render('quiz/score.html.twig', [
            'score' => $state['score'],
            'total' => count($state['questions']),
            'answers' => $state['answers'],
            'slug' => $slug,
        ]);
    }
}
```

## Les routes du quiz

| Méthode | URL | Nom | Description |
|---------|-----|-----|-------------|
| GET | `/` | `quiz_home` | Page d'accueil avec les thèmes |
| GET | `/quiz/{slug}/start` | `quiz_start` | Initialise le quiz en session |
| GET | `/quiz/{slug}/play` | `quiz_play` | Affiche la question courante |
| POST | `/quiz/{slug}/answer` | `quiz_answer` | Enregistre la réponse |
| GET | `/quiz/{slug}/score` | `quiz_score` | Affiche le score final |

## Les Templates

**templates/base.html.twig**

```twig
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Quiz Dev{% endblock %}</title>
    {% block stylesheets %}{% endblock %}
    {% block javascripts %}
        {{ importmap('app') }}
    {% endblock %}
</head>
<body>
    {% block body %}{% endblock %}
</body>
</html>
```

**templates/quiz/home.html.twig**

```twig
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Choisissez un thème</h1>

    <div class="grid">
        {% for theme in themes %}
            <a href="{{ path('quiz_start', {slug: theme.slug}) }}">
                <span>{{ theme.icon }}</span>
                <h2>{{ theme.name }}</h2>
                <p>{{ theme.count }} questions</p>
            </a>
        {% endfor %}
    </div>
{% endblock %}
```

**templates/quiz/play.html.twig**

```twig
{% extends 'base.html.twig' %}

{% block body %}
    <div data-controller="timer quiz"
         data-action="timer:timeout->quiz#handleTimeout">

        {# Timer #}
        <div>
            <div data-timer-target="bar"></div>
            <span data-timer-target="seconds">30</span>s
        </div>

        {# Progression #}
        <p>Question {{ current }} / {{ total }}</p>

        {# Question #}
        <h2>{{ question.text }}</h2>

        {# Options #}
        <form action="{{ path('quiz_answer', {slug: slug}) }}" method="POST"
              data-quiz-target="form">
            <input type="hidden" name="answer" value="-1"
                   data-quiz-target="input">

            {% for option in question.options %}
                <button type="button"
                        data-quiz-target="option"
                        data-action="click->quiz#selectAnswer"
                        data-index="{{ loop.index0 }}"
                        data-correct="{{ question.correct }}">
                    {{ option }}
                </button>
            {% endfor %}
        </form>
    </div>
{% endblock %}
```

**templates/quiz/score.html.twig**

```twig
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Résultat</h1>

    <p>{{ score }} / {{ total }}
       ({{ ((score / total) * 100)|round }}%)</p>

    {# Détail des réponses #}
    {% for answer in answers %}
        <div class="{{ answer.isCorrect ? 'correct' : 'wrong' }}">
            <p>{{ answer.question }}</p>
            {% if not answer.isCorrect and answer.explanation %}
                <p>{{ answer.explanation }}</p>
            {% endif %}
        </div>
    {% endfor %}

    <a href="{{ path('quiz_start', {slug: slug}) }}">Rejouer</a>
    <a href="{{ path('quiz_home') }}">Autres thèmes</a>
{% endblock %}
```

## Stimulus Controllers

**assets/controllers/timer_controller.js**

```javascript
import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
    static targets = ['bar', 'seconds']

    connect() {
        this.duration = 30
        this.remaining = this.duration
        this.start()
    }

    start() {
        this.interval = setInterval(() => {
            this.remaining--
            this.secondsTarget.textContent = this.remaining

            // Mise à jour de la barre
            const percent = (this.remaining / this.duration) * 100
            this.barTarget.style.width = `${percent}%`

            // Changement de couleur
            if (this.remaining <= 5) {
                this.barTarget.classList.add('pulse', 'bg-red-500')
            } else if (this.remaining <= 10) {
                this.barTarget.classList.add('bg-yellow-500')
            }

            // Temps écoulé
            if (this.remaining <= 0) {
                clearInterval(this.interval)
                this.dispatch('timeout')
            }
        }, 1000)
    }

    disconnect() {
        clearInterval(this.interval)
    }
}
```

**assets/controllers/quiz_controller.js**

```javascript
import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
    static targets = ['option', 'form', 'input']

    selectAnswer(event) {
        const button = event.currentTarget
        const index = parseInt(button.dataset.index)
        const correct = parseInt(button.dataset.correct)

        // Feedback visuel
        this.optionTargets.forEach(opt => {
            opt.disabled = true
            const i = parseInt(opt.dataset.index)
            if (i === correct) {
                opt.classList.add('bg-green-500', 'text-white')
            } else if (i === index && index !== correct) {
                opt.classList.add('bg-red-500', 'text-white')
            }
        })

        // Enregistrer la réponse et soumettre
        this.inputTarget.value = index
        setTimeout(() => this.formTarget.submit(), 1500)
    }

    handleTimeout() {
        this.inputTarget.value = -1
        this.formTarget.submit()
    }
}
```

## Format des données YAML

**data/quizzes/php.yaml** (exemple)

```yaml
name: "PHP"
icon: "🐘"
questions:
    - text: "Quel symbole commence une variable en PHP ?"
      options:
          - "@"
          - "#"
          - "$"
          - "&"
      correct: 2
      explanation: "En PHP, les variables commencent par le signe $"

    - text: "Quelle fonction affiche du texte en PHP ?"
      options:
          - "print()"
          - "echo"
          - "console.log()"
          - "printf()"
      correct: 1
      explanation: "echo est la structure de langage la plus courante pour afficher du texte"
```

## Exercices proposés

**Facile** : Ajouter un nouveau thème de quiz (créer un fichier YAML dans `data/quizzes/`)

**Moyen** : Ajouter un mode révision sans timer (nouveau paramètre de route + condition dans le template)

**Avancé** : Persister les scores avec Doctrine (entité Score, repository, formulaire pseudo)
