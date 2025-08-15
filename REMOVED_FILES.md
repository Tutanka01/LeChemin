Les fichiers suivants ont été rendus obsolètes par la migration vers une architecture MPA et peuvent être supprimés définitivement si plus aucune référence:

- src/App.tsx (ancien conteneur SPA avec Helmet)
- src/main.tsx (ancien entrypoint React root)

Actions déjà effectuées:
- Dependencies SPA (react-helmet-async) retirées du package.json
- Entrypoints MPA actuels: index.html -> /src/home.tsx et parcours.html -> /src/parcours.tsx
- Sitemap mis à jour pour inclure /parcours.html
- Metadonnées SEO enrichies pour parcours.html

Si tout fonctionne en dev et en build, vous pouvez maintenant supprimer manuellement ces fichiers ou garder REMOVED_FILES.md comme note historique.
