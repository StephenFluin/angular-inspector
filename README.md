# Angular Inspector

A Chrome extension that shows the frameworks, libraries, analytics, hosting and server software used by the
sites you visit, with a focus on Angular (version, SSR/hydration, Zone.js, Angular Material).

## How it works

| File                                           | Runs in                  | Job                                                                    |
| ---------------------------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| `src/detector.ts` + `src/lib/detect.ts`        | page MAIN world          | Looks at page globals, DOM, `<meta>` and `<script>` tags               |
| `src/bridge.ts`                                | content script, isolated | Relays detector results to the service worker, handles rescans/bfcache |
| `src/service_worker.ts` + `src/lib/headers.ts` | service worker           | Reads main-frame response headers, stores per-tab results, sets icon   |
| `src/popup.ts`                                 | popup                    | Reads results from `chrome.storage.session` and renders them           |

Per-tab results live in `chrome.storage.session`, so they survive the MV3 service worker being stopped.

Tool names, links, categories and icons are in `src/tool-metadata.ts`. Tools with a `brand` use a
[Simple Icons](https://simpleicons.org) SVG from `src/apps/brands/`; the service worker rasterizes it with
`Path2D` for the toolbar, since Chrome's action API doesn't accept SVG files.

## Development

Requires Node 22+ and npm.

```sh
npm install
npm run watch        # rebuild src/dist on change; load src/ as an unpacked extension
npm test             # unit tests (node:test)
npm run typecheck
npm run check-icons  # every detected tool has metadata and an icon
npm run icons        # regenerate src/apps/brands/*.svg after adding a `brand`
npm run package      # checks + production build + ai.zip for the Chrome Web Store
npm version minor --no-git-tag-version  # bump package.json and src/manifest.json together
```

### Adding a detection

1. Add a rule to `src/lib/detect.ts` (page-side) or `src/lib/headers.ts` (response headers).
2. Add an entry for the same id in `src/tool-metadata.ts` (use `brand` for a Simple Icons slug).
3. `npm run icons && npm run check-icons`.
