# Teptop CLI

`teptop-cli` creates and manages Teptop projects. It is an orchestration and scaffolding tool; it does not replace the runtime or force JSX on projects that prefer `h()`.

## Commands

```sh
teptop create dashboard
teptop create dashboard --template minimal
teptop create counter-kit --template library
npm run cli -- create minimal dashboard-without-jsx
teptop generate page account-settings
teptop generate component status-badge
teptop add plugin analytics
teptop info
teptop doctor
teptop config show
teptop dev
teptop build
teptop test
teptop typecheck
teptop version
```

Templates:

- `app`: Vite + TypeScript + TSX automatic runtime.
- `minimal`: Vite + JavaScript + `h()`, with no JSX requirement.
- `library`: TypeScript package with declaration output and tests.

Project management commands locate the nearest parent package containing a Teptop runtime dependency or `teptop.config.js`. Script commands forward to that project's npm scripts and preserve their exit code.

`doctor` reports missing setup by project type; `info` prints the detected package/runtime/scripts; `config show` prints the project's Teptop configuration.

The CLI is linked to the active `teptop.js` workspace package. It reads the runtime's exported version when it writes a starter manifest and reports both CLI/runtime versions with `teptop version`.

Generation validates names, refuses to overwrite existing projects/files, and keeps generated paths inside the project root.
