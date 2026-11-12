# Guia de Deploy & Produção — GL PRO FIT

## 1. Visão Geral
Este documento especifica os passos para efetuar o deploy da aplicação **GL PRO FIT v2.5.0** em ambiente de produção utilizando Docker ou Node.js nativo.

## 2. Pré-requisitos
- **Node.js:** v18 ou superior (Node.js 20 recomendado).
- **npm:** v9 ou superior.
- **Docker & Docker Compose:** Opcional (para containerização).
- **Projeto Firebase:** Configurado com Cloud Firestore e Firebase Authentication.

## 3. Variáveis de Ambiente (`.env`)
Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
PORT=3000
NODE_ENV=production
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=applet-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=applet-id
VITE_FIREBASE_STORAGE_BUCKET=applet-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
GEMINI_API_KEY=AIzaSy...
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

## 4. Deploy via Docker

### 4.1. Construção da Imagem
```bash
docker build -t glprofit:2.5.0 .
```

### 4.2. Execução do Contêiner
```bash
docker run -d \
  --name glprofit-app \
  -p 3000:3000 \
  --env-file .env \
  glprofit:2.5.0
```

## 5. Deploy Nativo (Node.js + Express)

### 5.1. Instalar Dependências e Fazer Build
```bash
npm install
npm run build
```

### 5.2. Iniciar Servidor de Produção
```bash
npm start
```
O servidor Express rodará na porta `3000`, servindo os arquivos estáticos compilados do Vite em `dist/` e tratando as rotas de API server-side (`/api/*`).

## 6. Verificação de Saúde (Health Check)
Após subir o servidor, execute um teste de conectividade:
```bash
curl http://localhost:3000/api/health
```
Resposta esperada:
```json
{
  "status": "healthy",
  "version": "2.5.0",
  "system": "GL PRO FIT"
}
```
