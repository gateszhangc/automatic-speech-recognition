# Automatic Speech Recognition

Keyword-focused website for `automatic-speech-recognition.homes`.

## Local Development

```bash
npx -y pnpm@10 install
DATABASE_PROVIDER=sqlite \
DATABASE_URL=file:data/local.db \
AUTH_SECRET=local-dev-secret \
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3007 \
AUTH_URL=http://127.0.0.1:3007 \
node node_modules/next/dist/bin/next dev --turbopack -p 3007 -H 0.0.0.0
```

Open `http://127.0.0.1:3007/`.

## Checks

```bash
npx -y pnpm@10 lint
npx -y pnpm@10 build
```

## License

See [LICENSE](./LICENSE).
