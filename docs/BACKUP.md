# Procedimentos de Backup & Recuperação de Desastres — GL PRO FIT

## 1. Visão Geral
Este documento estabelece as rotinas de backup, restauração e exportação de dados da plataforma **GL PRO FIT v2.5.0**.

## 2. Estratégia de Backup

### 2.1. Backup em Nuvem — Firebase Firestore
A persistência primária é mantida no Google Cloud Firestore.
- **Backups Automáticos Diários:** Agendados via Google Cloud Scheduled Backups.
- **Comando Manual via gcloud CLI:**
```bash
gcloud firestore export gs://[SEU_BUCKET_BACKUP]/firestore-backups-$(date +%Y%m%m)
```
- **Retenção:** 30 dias para snapshots diários e 12 meses para snapshots mensais.

### 2.2. Backup Local & Exportação de Emergência
No painel do sistema em **Configurações > Backup & Restauração**:
- O administrador pode clicar em **"Gerar Backup JSON Completo"** para efetuar o download imediato de todas as coleções do sistema em formato JSON compactado.
- Arquivos exportados: `glprofit_backup_full_[timestamp].json`.

## 3. Procedimento de Restauração (Disaster Recovery)

### 3.1. Restauração via gcloud CLI
Para restaurar a partir de um snapshot do Cloud Storage:
```bash
gcloud firestore import gs://[SEU_BUCKET_BACKUP]/firestore-backups-[DATA]
```

### 3.2. Restauração via Painel Web
Em **Configurações > Backup & Restauração**:
1. Selecione a opção **"Importar Backup JSON"**.
2. Faça o upload do arquivo `glprofit_backup_full_[timestamp].json`.
3. Confirme a validação de esquema. O sistema executará um `syncCollectionToFirestore` em lote para todas as 20+ coleções ativas.

## 4. Auditoria de Integridade
A integridade dos backups deve ser auditada trimestralmente através de restauração em ambiente de homologação/staging.
