# Roadmap IA — Intégration

Ce projet inclut un quiz pour générer une roadmap personnalisée. Par défaut, un mock local est utilisé. Pour activer l’IA réelle via OpenRouter, déployez une fonction Edge Supabase et configurez l’endpoint côté client.

## 1) Déployer la fonction Edge

- Prérequis: CLI Supabase, projet configuré.
- Fichiers: `supabase/functions/ai-roadmap/*` (Deno)

Étapes:
1. Définir la variable d’env pour la fonction:
   - OPENROUTER_API_KEY=<votre_clef>
2. Déployer:
   - supabase functions deploy ai-roadmap
3. Vérifier l’URL publique de la fonction (pattern: https://<project>.functions.supabase.co/ai-roadmap)

## 2) Configurer le client

Dans votre `.env` Vite:
- VITE_AI_ROADMAP_ENDPOINT=https://<project>.functions.supabase.co/ai-roadmap

Le client tentera d’appeler cet endpoint; en cas d’erreur/absence de config, il revient automatiquement au mock.

## 3) Sécurité & Validation

- La fonction ne retourne que du JSON validé sur un schéma strict.
- Timeout de 30s et gestion des erreurs amont/aval.
