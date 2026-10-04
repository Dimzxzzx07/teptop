# Teptop Dash Admin

A lightweight, resource-oriented admin template built with Teptop signals, plain JavaScript/HTML/CSS, and a Node.js REST backend. It uses no React, Yarn, bundler, or third-party runtime dependency.

## Features

- Admin session login with HttpOnly, SameSite cookies and an in-memory session store.
- Resource CRUD for customers, products, and orders.
- Server-side validation, filtering, search, pagination, and JSON-file persistence.
- Overview metrics and recent orders.
- Responsive navigation, keyboard-friendly forms, loading/error states, and explicit empty states.
- Teptop runtime is served from the installed `teptop.js` package at `/runtime/*`.

## Run

From the repository root, install workspace dependencies once, then run:

```sh
npm run demo:admin
```

Open `http://127.0.0.1:4175`. Development credentials are printed by the server; defaults are `admin` / `teptop-admin`. Set `DASH_ADMIN_USER` and `DASH_ADMIN_PASSWORD` before starting to override them. Set `DASH_ADMIN_DATA_FILE` to choose a different JSON store path.

To run only this template's API tests:

```sh
npm test --workspace @teptop/template-dash-admin
```

To run Chromium end-to-end tests from the repository root:

```sh
npm run test:browser:admin
```

## API

- `GET /api/health`
- `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET /api/dashboard`
- `GET|POST /api/:resource`
- `GET|PATCH|DELETE /api/:resource/:id`

The bundled JSON store is intended for local development and small demos. Replace it with a database adapter and production identity provider before deploying multi-user production workloads. Configure a strong password, HTTPS, and a persistent data volume in production.
