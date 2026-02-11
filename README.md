# Prof Resources

Site de ressources pédagogiques multi-écoles avec support pour :
- 📝 Code viewer avec copie en 1 clic
- 📊 Présentations téléchargeables
- 🏫 Organisation par école et spécialité

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **TypeScript**
- **Shiki** (coloration syntaxique)

## Installation

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure

```
prof-resources/
├── app/                    # Pages Next.js
│   ├── page.tsx            # Accueil
│   ├── [school]/           # Pages dynamiques
│   ├── admin/              # Interface admin
│   └── api/                # API routes
├── components/             # Composants React
├── content/                # Contenu (versionné)
│   ├── schools.json        # Config écoles
│   └── courses/            # Dossiers cours
├── lib/                    # Utilitaires
└── public/                 # Fichiers statiques
```

## Ajouter un cours

1. Créer un dossier dans `content/courses/mon-cours/`

2. Ajouter `meta.json` :
```json
{
  "id": "mon-cours",
  "title": "Mon Cours",
  "description": "Description du cours",
  "school": "ubo",
  "specialty": "deust-tmic",
  "tags": ["tag1", "tag2"],
  "resources": [
    { "id": "code", "type": "code", "title": "Code", "file": "code.md" },
    { "id": "pptx", "type": "download", "title": "Slides", "file": "files/slides.pptx" }
  ]
}
```

3. Ajouter les fichiers :
   - `resources/code.md` - Code Markdown avec blocs de code
   - `resources/files/*.pptx` - Fichiers téléchargeables

## Ajouter une école/spécialité

Modifier `content/schools.json` :

```json
{
  "schools": [
    {
      "id": "nouvelle-ecole",
      "name": "NE",
      "fullName": "Nouvelle École",
      "color": "#e94560",
      "logo": "🎓",
      "specialties": [
        { "id": "spec1", "name": "Spé 1", "fullName": "Spécialité 1", "year": "2024-2025" }
      ]
    }
  ]
}
```

## Déploiement

### Vercel (recommandé)

1. Push sur GitHub
2. Importer sur [vercel.com](https://vercel.com)
3. Auto-deploy à chaque push

### Autre

```bash
npm run build
npm run start
```

## URLs

- `/` - Accueil (sélection école)
- `/ubo` - Spécialités UBO
- `/ubo/deust-tmic` - Cours DEUST
- `/ubo/deust-tmic/symfony-tp-tailwind` - Page cours
- `/admin` - Dashboard admin

## Écoles configurées

- 🎓 **UBO** - Université de Bretagne Occidentale
  - DEUST T-MIC
- ⚡ **ISEN** - ISEN Brest
  - CIR2, CIR3, M2
- 🌍 **UIT** - Université Internationale de Tunis
  - L3 Info

## License

MIT
