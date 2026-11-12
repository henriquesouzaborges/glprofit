# Manual de Conformidade LGPD & Proteção de Dados — GL PRO FIT

## 1. Introdução & Base Legal
O **GL PRO FIT v2.5.0** adota conformidade total com a **Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)**.

Os dados de saúde, fisiológicos e biométricos coletados pelos módulos de Avaliações Físicas e Bem-Estar são classificados como **dados pessoais sensíveis** (Art. 5º, II da LGPD), exigindo consentimento inequívoco e hipóteses de salvaguarda rigorosas.

## 2. Tratamento de Dados Sensíveis de Saúde
Os seguintes dados sensíveis são armazenados com acesso restrito por perfil de usuário:
- **Avaliações Físicas:** Protocolos de Pollock (3 e 7 dobras), bioimpedância, perímetros corporais e fotos posturais.
- **Prontidão & Bem-Estar:** Questionário diário de Hooper, Escala Visual Analógica (EVA) de dor muscular, nível de estresse e dados do ciclo menstrual.
- **Isolamento de Acesso:** Perfis com função `recepcao` ou `aluno` (sem acesso às avaliações dos demais alunos) não possuem permissão de leitura sobre a coleção `physical_assessments` e `wellness_checkins`.

## 3. Gestão de Consentimento
- **Registro do Consentimento:** Na criação de qualquer aluno (`Student`), o sistema obriga os atributos:
  - `consentLgpd: true`
  - `consentLgpdDate`: Data ISO do momento do aceite.
  - `consentLgpdVersion`: Versão do termo vigente (ex: `"2026-11"`).
- **Validação no Firestore (`firestore.rules`):**
  - A criação de documentos na coleção `students` exige que `incoming().consentLgpd == true`.

## 4. Direitos do Titular de Dados

### 4.1. Direito à Portabilidade (Exportação Completa)
- **Endpoint HTTP REST:** `GET /api/lgpd/export/:studentId`
- **Requisito de Segurança:** Requer cabeçalho `Authorization: Bearer <Firebase_ID_Token>` de um usuário autenticado com permissão.
- **Conteúdo Exportado:** Ficha do aluno, contratos, faturas financeiras, planos de treino, avaliações físicas completas e histórico de check-ins de bem-estar em formato JSON estruturado.
- **Botão na Interface:** Disponível na sub-aba **Dados do Cadastro** na Ficha do Aluno.

### 4.2. Direito ao Esquecimento (Anonimização & Expurgo)
- **Endpoint HTTP REST:** `DELETE /api/lgpd/delete/:studentId`
- **Requisito de Segurança:** Requer token de autenticação e função `admin` ou `gerente`.
- **Efeito:** Anonimiza campos de identificação (nome passa a `[ALUNO ANONIMIZADO LGPD]`, CPF e e-mail limpos) e remove dados biométricos/clínicos das coleções secundárias, registrando a operação em log de auditoria.

## 5. Registros de Auditoria (Audit Logs)
Todas as exportações e solicitações de esquecimento são gravadas na coleção `security_audit_logs` no Firestore com identificador do operador, IP, data e motivo.
