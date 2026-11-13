# Portfolio — Thomas Dumas

Site statique (HTML/CSS/JS, sans outil de build). Sombre, sobre, une page d'accueil
avec la grille des projets et une page par projet.

## Modifier le contenu

Tout le texte et les médias sont dans **`content.js`** :

- `SITE` : nom, phrase d'accroche, rôles, liens réseaux, e-mail (optionnel)
- `PROJECTS` : la liste des projets, dans l'ordre d'affichage
- `ABOUT` : la page « À propos » (texte, parcours, compétences, CV)

Chaque projet est composé de blocs : `photos`, `youtube`, `featured` (grande vidéo),
`adobe` (vidéos hébergées sur Adobe), `instagram`. Le format est décrit en haut du fichier.

### Ajouter des photos

1. Exporter en JPEG, ~1800 px de large max.
2. Placer le fichier dans `assets/img/` et une version ~900 px dans `assets/img/thumb/`
   (même nom).
3. Ajouter ses dimensions dans `assets/manifest.js`, puis son nom (sans `.jpg`) dans
   le bloc `photos` voulu de `content.js`.

### Ajouter une vidéo YouTube ou un post Instagram

- YouTube : ajouter `{ id: "XXXXXXXXXXX" }` dans un bloc `youtube` (l'ID est la fin de
  l'URL `youtu.be/XXXXXXXXXXX`).
- Instagram : coller l'URL du post/reel dans un bloc `instagram`.

## Voir le site en local

```bash
python3 -m http.server 8080
```

puis ouvrir http://localhost:8080

## Notes

- Les vidéos des pages « Production vidéo » et « Corporate » sont encore lues depuis
  le lecteur Adobe de l'ancien portfolio. Si l'abonnement Adobe Portfolio s'arrête,
  elles risquent de disparaître : les remettre sur YouTube ou Vimeo et remplacer les
  blocs `adobe` par des blocs `youtube`.
- `tools/` contient le script qui a récupéré les images de l'ancien portfolio.
