# Video portfolio

Static single-page site: `index.html` (inline CSS/JS) plus `nash-photo.png`. No build step.

- Preview: `npm run serve`, then open http://localhost:8000
- Lint HTML: `npm run lint` (html-validate, config in `.htmlvalidate.json`)
- Tests: `npm test` (Node built-in test runner, `tests/*.test.js`)

In Claude Code on the web, `.claude/hooks/session-start.sh` runs `npm install` at session start.
