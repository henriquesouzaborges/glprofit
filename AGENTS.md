# Regras do Projeto GL PRO FIT

## Controle Contínuo de Versão
- **Regra Obrigatória:** A cada comando ou solicitação de alteração no sistema, a versão corrente deve ser sempre incrementada e atualizada.
- **Arquivos a atualizar:**
  - `src/version.ts`: Atualizar `SYSTEM_VERSION_INFO.version` (ex: `v1.4.1` -> `v1.4.2`), `buildNumber`, `releaseDate` e adicionar o novo item no array `changelog` detalhando o que foi feito.
  - `package.json`: Manter o campo `"version"` sincronizado (ex: `"1.4.2"`).
- O rodapé (`src/components/Footer.tsx`) e a barra lateral consomem automaticamente essa configuração para exibir a versão ativa do sistema.
