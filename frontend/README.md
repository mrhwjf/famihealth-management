# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
\n+## Backend Integration\n+\n+To integrate with the backend, add env variables and use the shared API client.\n+\n+- Create a `.env` file in `frontend/` with:\n+\n+```\n+VITE_API_BASE_URL=http://localhost:8080\n+VITE_API_PREFIX=/api\n+```\n+\n+- Use the shared client in code:\n+\n+```js\n+import api from './src/services/apiClient';\n+\n+// Example\n+const res = await api.get('/users');\n+```\n+\n+- During development, calls to `/api/*` are proxied to `VITE_API_BASE_URL`.\n*** End Patch
