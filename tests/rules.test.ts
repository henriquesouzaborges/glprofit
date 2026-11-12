import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Validação de Regras de Segurança (firestore.rules)', () => {
  const rulesPath = path.join(process.cwd(), 'firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf-8');

  it('Deve conter declaração de versão 2 do Firestore Rules', () => {
    expect(rulesContent).toContain("rules_version = '2';");
  });

  it('Deve bloquear atributo password em documentos do incoming', () => {
    expect(rulesContent).toContain("!('password' in request.resource.data)");
  });

  it('Deve verificar papel de admin para coleção empresas_clientes', () => {
    expect(rulesContent).toContain('match /empresas_clientes/{empresaId}');
    expect(rulesContent).toContain('userRole() == "admin"');
  });

  it('Deve exigir consentLgpd == true na criação de alunos', () => {
    expect(rulesContent).toContain('request.resource.data.consentLgpd == true');
  });

  it('Deve restringir visualização de avaliações físicas e checkins de saúde para recepção e alunos', () => {
    expect(rulesContent).toContain('match /physical_assessments/{assessmentId}');
    expect(rulesContent).toContain('match /wellness_checkins/{checkinId}');
    expect(rulesContent).toContain('userRole() in ["admin", "gerente", "treinador", "financeiro"]');
  });

  it('Deve conter negação padrão por padrão (default deny)', () => {
    expect(rulesContent).toContain('match /{document=**}');
    expect(rulesContent).toContain('allow read, write: if false;');
  });
});
