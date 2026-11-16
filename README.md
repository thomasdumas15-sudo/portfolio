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

1. Exporter en JPEG et placer le fichier dans `assets/img/` (ex. `photo-6-01.jpg`).
2. Lancer `python3 tools/optimize.py` : il crée la miniature, les versions AVIF
   (2 à 4 fois plus légères) et met à jour `assets/manifest.js`. Nécessite `ffmpeg`
   (`brew install ffmpeg`).
3. Ajouter le nom (sans `.jpg`) dans un bloc `photos` de `content.js`.
4. Si vous **remplacez** une image existante, augmenter `V` en haut de `app.js`
   (ex. `?v=3`) pour que les visiteurs voient la nouvelle version.

### Ajouter une vidéo YouTube ou un post Instagram

- YouTube : ajouter `{ id: "XXXXXXXXXXX" }` dans un bloc `youtube` (l'ID est la fin de
  l'URL `youtu.be/XXXXXXXXXXX`).
- Instagram : coller l'URL du post/reel dans un bloc `instagram`, puis lancer
  `python3 tools/optimize.py` pour récupérer son aperçu.
- Vidéo Adobe : ajouter `{ id: "...", ratio: "9/16" }` dans un bloc `adobe`, puis
  lancer `python3 tools/optimize.py`.

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
- Les vidéos et posts Instagram n'affichent qu'un aperçu ; le lecteur ne se charge
  qu'au clic (page beaucoup plus rapide).
- `tools/fetch_images.py` a récupéré les images de l'ancien portfolio ;
  `tools/optimize.py` prépare les images (miniatures, AVIF, aperçus).
