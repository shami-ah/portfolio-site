# Staging

| Branch | Deploys to | How |
|---|---|---|
| `staging` | https://ahteshams-mac-mini.tailffe90b.ts.net:8443 | Shami's Mac mini checks the branch every 2 minutes and redeploys when it moves |
| `main` | https://ahtesham.dev.wadwarehouse.com | GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main` |

## Workflow

1. Branch off `staging`: `git switch staging && git pull && git switch -c feat/<topic>`.
2. Open a PR into `staging` with a conventional title (`feat:`, `fix:`, `refactor:`, `test:`) and paste the eval summary.
3. After the merge, wait about 2 minutes and open the staging URL.
4. Shami merges `staging` into `main` to release. Never push to `main` directly.

Before every PR: `npm run build`, `npx tsc --noEmit`, `npm run lint`, `npm run test:chat-eval`.

## Is my change live?

- `/staging.json` shows the deployed commit, or `"status": "failed"` with the reason.
- `/staging-build.txt` shows the last 150 lines of the build log after a failed build.
- `/api/health` shows the chat model and whether the embedding index is ready.

A commit that fails to build is not retried; push a fix and the next commit deploys.

## Chat on staging

- NVIDIA chat `nvidia/nemotron-3-ultra-550b-a55b`, with fallbacks `nemotron-3.5-lightning-30b-a3b` and `nemotron-3.5-super-vl-120b-a12b`.
- Embeddings: `nvidia/nemotron-3.5-embed-1b` (`nemotron-3-embed-1b` returns 410 since ~20 Nov 2026), kept in memory and cached on disk, so a restart only embeds changed chunks.
- The key lives on the Mac mini only. To run the eval against staging:
  `CHAT_EVAL_API_URL=https://ahteshams-mac-mini.tailffe90b.ts.net:8443/api/chat npm run test:chat-eval`
- The API allows 10 requests per window per visitor, so the eval may hit the rate limit if several people run it at once.

Staging sends `X-Robots-Tag: noindex` and a disallow-all `robots.txt`, so search engines skip it.
