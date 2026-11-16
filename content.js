/*
  CONTENU DU PORTFOLIO
  --------------------
  Tout le texte et les médias du site sont ici. Pour modifier le site,
  il suffit en général d'éditer ce fichier.

  Types de blocs possibles dans "blocks" :
    { type: "text", title?: "...", text: "..." }
    { type: "photos", title?: "...", text?: "...", images: ["photo-1-01", ...] }
    { type: "youtube", title?: "...", items: [{ id: "xxxx", cover?: "inside-01", label?: "..." }] }
    { type: "featured", id: "youtubeId", label?: "..." }            -> grande vidéo YouTube
    { type: "adobe", title?: "...", text?: "...", items: [{ id: "xxxx", ratio: "9/16" | "16/9" | "4/3" }] }
    { type: "instagram", title?: "...", items: ["https://www.instagram.com/reel/.../", ...] }

  Les images sont dans assets/img/ (grand format) et assets/img/thumb/ (miniatures),
  on les référence par leur nom sans extension.
*/

window.SITE = {
  name: "Thomas Dumas",
  tagline: "Filmer, photographier, créer, écrire, autant de façons de refuser l'oubli.",
  roles: ["Responsable communication", "Social media manager", "Photographe", "Vidéaste", "Graphiste"],
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/thomasdms_/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/thomas-dumas-065230244" }
  ],
  // Adresse e-mail affichée dans le pied de page (laisser vide pour la masquer)
  email: ""
};

window.PROJECTS = [
  {
    slug: "inside-elan-chalon",
    title: "Inside Elan Chalon",
    kind: "Série documentaire",
    cover: "cover-inside",
    intro:
      "Une saison de basket, ce sont des trajets, des hôtels, des rires dans les vestiaires, des silences avant un gros déplacement. Ces Insides de saison capturent ce hors-champ avec la volonté de raconter le club autrement.",
    blocks: [
      { type: "featured", id: "0IBjLQAu9l8", cover: "inside-02", label: "À la une" },
      {
        type: "youtube",
        title: "Insides de saison",
        items: [
          { id: "ZGnsbr5fWaE", cover: "inside-01" },
          { id: "0IBjLQAu9l8", cover: "inside-02" },
          { id: "vnGRu6sZWRI", cover: "inside-03" }
        ]
      },
      {
        type: "youtube",
        title: "Tournoi qualificatif BCL — Bulgarie",
        text:
          "7 épisodes pour raconter le tournoi qualificatif à la BCL en Bulgarie. Coulisses, déplacements, vestiaires, moments off. Un format pensé pour raconter de l'intérieur l'histoire de cette équipe.",
        items: [
          { id: "EVl9tyfRCvw", cover: "inside-04", label: "Épisode 1" },
          { id: "6zl2wMj5IqM", cover: "inside-05", label: "Épisode 2" },
          { id: "FZKyqZlL-2c", cover: "inside-06", label: "Épisode 3" },
          { id: "hsXCRq0OYYg", cover: "inside-07", label: "Épisode 4" },
          { id: "z6r7x0e5z7Y", cover: "inside-08", label: "Épisode 5" },
          { id: "RY_wCWiF1gE", cover: "inside-09", label: "Épisode 6" },
          { id: "4knGhhbS5CA", cover: "inside-10", label: "Épisode 7" }
        ]
      }
    ]
  },
  {
    slug: "production-video",
    title: "Production vidéo",
    kind: "Vidéo",
    cover: "cover-video",
    intro:
      "Trois saisons de production vidéo pour l'Elan Chalon : teasers de match, résumés, recaps, brand content partenaires et formats émotionnels. De la captation au montage, en passant par l'étalonnage et le sound design, chaque vidéo répond à un objectif éditorial précis : faire monter l'attente avant un match, prolonger l'expérience après, ou raconter la saison.",
    blocks: [
      {
        type: "adobe",
        items: [
          { id: "6-ms5qPo-KS", ratio: "9/16" },
          { id: "5PsKURJjUuq", ratio: "9/16" },
          { id: "6kD57Yyso3t", ratio: "9/16" },
          { id: "U97xbTWInRW", ratio: "9/16" },
          { id: "DzI465GXtGL", ratio: "9/16" },
          { id: "SpzRYzcbcG5", ratio: "16/9" },
          { id: "FMKXWq8HI_h", ratio: "16/9" },
          { id: "Ji3jQpdNzTV", ratio: "16/9" },
          { id: "Im7XMcwKr8q", ratio: "16/9" },
          { id: "K7zRAJyYne_", ratio: "4/3" }
        ]
      },
      {
        type: "adobe",
        title: "Le snack content",
        text: "Sélection de formats courts produits pour les réseaux sociaux de l'Elan Chalon.",
        items: [
          { id: "G8oCcI2F2I3", ratio: "9/16" },
          { id: "W8quBG5wE7V", ratio: "9/16" },
          { id: "TnGGcTCECKs", ratio: "9/16" },
          { id: "VJJ-rsBVdGE", ratio: "9/16" }
        ]
      }
    ]
  },
  {
    slug: "reseaux-sociaux",
    title: "Réseaux sociaux",
    kind: "Social media",
    cover: "photo-5-01",
    intro:
      "Une sélection de publications réalisées pour le compte Instagram de l'Elan Chalon : reels, annonces et formats d'équipe.",
    blocks: [
      {
        type: "instagram",
        title: "Reels",
        items: [
          "https://www.instagram.com/reel/DU1Ix82jVFw/",
          "https://www.instagram.com/reel/DQra6YNCEnZ/",
          "https://www.instagram.com/reel/DUsjo4_DXjo/",
          "https://www.instagram.com/reel/DJ16V9jN35c/"
        ]
      },
      {
        type: "instagram",
        title: "Publications",
        items: [
          "https://www.instagram.com/p/De9vxnaNPG2/",
          "https://www.instagram.com/p/DeZj1v2AXms/",
          "https://www.instagram.com/p/DcwCXU0NaoE/"
        ]
      }
    ]
  },
  {
    slug: "direction-artistique-photos",
    title: "Direction artistique & photos",
    kind: "Photo · DA",
    cover: "cover-photo",
    intro:
      "Annonce du nouveau maillot européen, portée par Jordan. Direction artistique, mise en scène et shooting pensés comme une campagne à part entière : au-delà du simple visuel produit, l'idée était de donner au maillot une présence cinématographique, à la hauteur de l'enjeu sportif que représente la Coupe d'Europe pour le club.",
    blocks: [
      { type: "photos", title: "Maillot européen", images: range("photo-1", 8) },
      { type: "photos", title: "T-shirt All-Star", text: "Drop d'un t-shirt événementiel à l'occasion du All-Star Game LNB 2025.", images: range("photo-2", 6) },
      { type: "photos", title: "All-Star Game LNB 2025", text:"Trois joueurs de l'Elan Chalon sélectionnés pour le All-Star Game LNB 2025.", images: range("photo-3", 20) },
      { type: "photos", title: "Création graphique", images: range("photo-4", 15) },
      { type: "photos", title: "Trois saisons", text: "Les images qui résument trois saisons, sans hiérarchie ni thématique. Matchs, coulisses, portraits, ambiances.", images: range("photo-5", 45) }
    ]
  },
  {
    slug: "corporate-evenementiel",
    title: "Corporate & événementiel",
    kind: "Événementiel",
    cover: "cover-corporate",
    intro:
      "Films d'événements réalisés pour les partenaires de l'Elan Chalon. Soirées VIP, activations, temps forts clients. De la captation au montage final, pour restituer l'atmosphère d'une soirée tout en valorisant la marque partenaire et le club.",
    blocks: [
      {
        type: "adobe",
        items: [
          { id: "4czYP4Cefbr", ratio: "16/9" },
          { id: "39cc2vmXK_3", ratio: "16/9" },
          { id: "R3KyLKr2mTf", ratio: "16/9" }
        ]
      }
    ]
  }
];

window.ABOUT = {
  slug: "a-propos",
  title: "À propos",
  cover: "cover-about",
  // CV téléchargeables (fichiers PDF dans assets/cv/). L'aperçu affiché est celui du premier.
  cvs: [
    { label: "CV en français", lang: "FR", file: "assets/cv/thomas-dumas-cv-fr.pdf", preview: "assets/cv/preview-fr.jpg" },
    { label: "CV in English", lang: "EN", file: "assets/cv/thomas-dumas-cv-en.pdf", preview: "assets/cv/preview-en.jpg" }
  ],
  text: [
    "Social media manager issu du sport professionnel (Betclic Élite), aujourd'hui responsable communication d'une clinique de chirurgie esthétique premium à Lyon. J'interviens de la création de contenus à la stratégie digitale, avec un vrai goût du terrain et du contact.",
    "Photographe, vidéaste, graphiste : j'aime cette polyvalence parce qu'elle force à penser une marque comme un tout, pas comme une succession de formats isolés."
  ],
  timeline: [
    {
      title: "Expériences",
      items: [
        { when: "2026 — Aujourd'hui", what: "Responsable Communication", where: "Clinique XANADU, Lyon" },
        { when: "2023 — 2026", what: "Social Media Manager", where: "Élan Chalon (Betclic Élite), Chalon-sur-Saône" },
        { when: "2023 — 2026", what: "Photographe & vidéaste freelance", where: "FFBB (Équipes de France), LNB, LFB" },
        { when: "2024 — 2025", what: "Commercial freelance", where: "Prothermo, Lyon" },
        { when: "2022 — 2023", what: "Community Manager", where: "First Team, Paris" }
      ]
    },
    {
      title: "Formation",
      items: [
        { when: "2025", what: "Master 2 Manager de la Communication", where: "SupDeCom Lyon, en alternance" },
        { when: "2023", what: "Licence Gestion Management", where: "IAE Lyon" }
      ]
    }
  ],
  skills: ["Premiere Pro", "After Effects", "Lightroom", "Photoshop", "Figma", "Meta Ads", "Meta Business Suite", "Brevo", "WordPress", "Google Analytics", "Storytelling de marque", "Développement de communautés", "Gestion de projet"]
};

function range(prefix, n) {
  return Array.from({ length: n }, (_, i) => `${prefix}-${String(i + 1).padStart(2, "0")}`);
}
