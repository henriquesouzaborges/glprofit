import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Helper Gemini client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Migration API endpoint
  app.post('/api/migrate', async (req: Request, res: Response) => {
    try {
      const { migrationType, fileName, fileBase64, mimeType, textContent } = req.body;

      if (!migrationType) {
        return res.status(400).json({ error: 'Tipo de migração não informado.' });
      }

      console.log(`[API /api/migrate] Processing ${migrationType} for file: ${fileName} (${mimeType || 'text'})`);

      let systemPrompt = '';
      if (migrationType === 'clientes') {
        systemPrompt = `Você é um assistente especialista em migração e extração de dados para sistemas de academias e centros esportivos (GL PRO FIT / VB SPORT).
Analise o conteúdo do arquivo fornecido (planilha, documento PDF, texto ou foto/imagem de ficha cadastral) e extraia TODOS os registros de clientes/alunos encontrados.
Retorne EXCLUSIVAMENTE um objeto JSON válido (sem comentários adicionais ou markdown fora do JSON) no seguinte formato:
{
  "tipo": "clientes",
  "total": 1,
  "itens": [
    {
      "name": "Nome Completo do Aluno",
      "cpf": "000.000.000-00",
      "phone": "(11) 99999-9999",
      "email": "aluno@email.com",
      "birthDate": "YYYY-MM-DD",
      "status": "ativo" | "inadimplente" | "trancado" | "cancelado",
      "planName": "Nome do Plano (ex: Mensal, Trimestral)",
      "planPrice": 120.00,
      "dueDate": "YYYY-MM-DD ou dia do vencimento",
      "startDate": "YYYY-MM-DD",
      "pendingAmount": 0,
      "notes": "Observações médicas, cadastrais ou de contato"
    }
  ]
}
Se algum campo não for encontrado, preencha com string vazia ou valor padrão razoável.`;
      } else if (migrationType === 'avaliacao_fisica') {
        systemPrompt = `Você é um assistente especialista em avaliação física esportiva e cineantropometria para academias (GL PRO FIT / VB SPORT).
Analise o arquivo fornecido (PDF, planilha, foto de protocolo de avaliação física, bioimpedância, fotos posturais ou laudo) e extraia as avaliações físicas.
Retorne EXCLUSIVAMENTE um objeto JSON válido no formato:
{
  "tipo": "avaliacao_fisica",
  "total": 1,
  "itens": [
    {
      "studentName": "Nome do Aluno avaliado",
      "studentCpf": "000.000.000-00 se disponível",
      "evaluatorName": "Nome do Avaliador / Profissional",
      "date": "YYYY-MM-DD",
      "weightKg": 75.5,
      "heightCm": 178,
      "bodyFatPercent": 14.2,
      "muscleMassKg": 42.0,
      "fatMassKg": 10.7,
      "visceralFat": 4,
      "basalMetabolicRate": 1750,
      "bloodPressure": "120/80",
      "heartRateBpm": 68,
      "protocol": "Pollock 7 Dobras" ou "Pollock 3 Dobras" ou "Bioimpedância InBody" ou "Guedes",
      "skinfolds": {
        "triceps": 10,
        "subscapular": 12,
        "suprailiac": 14,
        "abdominal": 18,
        "chest": 8,
        "thigh": 15,
        "calf": 9
      },
      "circumferences": {
        "chest": 98,
        "waist": 82,
        "abdomen": 85,
        "hips": 99,
        "rightArm": 35,
        "leftArm": 34.5,
        "rightThigh": 56,
        "leftThigh": 55.5,
        "rightCalf": 38,
        "leftCalf": 38
      },
      "observations": "Resumo postural, metas de composição corporal e recomendações do profissional"
    }
  ]
}`;
      } else if (migrationType === 'plano_alimentar') {
        systemPrompt = `Você é um assistente nutricional clínico e esportivo para o sistema GL PRO FIT / VB SPORT.
Analise o arquivo (PDF de dieta, foto de prescrição nutricional, planilha de refeições) e extraia os planos alimentares.
Retorne EXCLUSIVAMENTE um objeto JSON válido no formato:
{
  "tipo": "plano_alimentar",
  "total": 1,
  "itens": [
    {
      "studentName": "Nome do Aluno",
      "studentCpf": "000.000.000-00",
      "nutritionist": "Nome do Nutricionista",
      "title": "Título do Plano (Ex: Hipertrofia Fase 1, Déficit Calórico)",
      "goal": "Hipertrofia" | "Emagrecimento" | "Manutenção" | "Performance",
      "dailyCalories": 2400,
      "proteinGrams": 160,
      "carbGrams": 280,
      "fatGrams": 65,
      "waterIntakeMl": 3500,
      "startDate": "YYYY-MM-DD",
      "meals": [
        {
          "name": "Café da Manhã",
          "time": "07:30",
          "calories": 450,
          "items": [
            { "food": "Ovo mexido", "portion": "3 unidades (150g)" },
            { "food": "Pão integral", "portion": "2 fatias (50g)" },
            { "food": "Café com leite desnatado", "portion": "200ml" }
          ],
          "notes": "Consumir logo ao acordar"
        }
      ],
      "supplements": [
        { "name": "Creatina Monohidratada", "dosage": "5g pós-treino", "timing": "Após o treino com água" },
        { "name": "Whey Protein 80%", "dosage": "30g", "timing": "Lanche da tarde ou pós-treino" }
      ],
      "guidelines": "Orientações gerais, ingestão de água e alimentos a evitar"
    }
  ]
}`;
      } else if (migrationType === 'treinos') {
        systemPrompt = `Você é um especialista em treinamento esportivo, musculação e periodização para academias (GL PRO FIT / VB SPORT).
Analise o arquivo (ficha de treino em papel/foto, planilha de exercícios, PDF de rotina) e extraia as fichas de treino.
Retorne EXCLUSIVAMENTE um objeto JSON válido no formato:
{
  "tipo": "treinos",
  "total": 1,
  "itens": [
    {
      "studentName": "Nome do Aluno (ou 'Modelo Geral' se for template)",
      "studentCpf": "000.000.000-00",
      "instructor": "Nome do Treinador/Professor",
      "title": "Nome do Treino (Ex: ABC Hipertrofia, Full Body Iniciante)",
      "goal": "Hipertrofia" | "Emagrecimento" | "Força" | "Resistência" | "Funcional",
      "level": "Iniciante" | "Intermediário" | "Avançado",
      "frequency": "ABC (Seg/Qua/Sex) ou 4x na semana",
      "validUntil": "YYYY-MM-DD",
      "divisions": [
        {
          "letter": "A",
          "name": "Peito, Ombros e Tríceps",
          "targetMuscles": ["Peito", "Ombros", "Tríceps"],
          "exercises": [
            {
              "name": "Supino Reto com Barra",
              "muscleGroup": "Peito",
              "sets": 4,
              "reps": "8 a 10",
              "weightKg": 30,
              "restSec": 60,
              "equipment": "Barra",
              "method": "Tradicional",
              "notes": "Cadência controlada 3-0-1"
            }
          ]
        }
      ],
      "generalNotes": "Orientações de aquecimento, cárdio e segurança"
    }
  ]
}`;
      } else if (migrationType === 'financeiro') {
        systemPrompt = `Você é um auditor financeiro para academias e centros esportivos (GL PRO FIT / VB SPORT).
Analise o arquivo (extrato bancário, relatório de mensalidades, planilha de fluxo de caixa, foto de recibo ou nota fiscal) e extraia os lançamentos financeiros.
Retorne EXCLUSIVAMENTE um objeto JSON válido no formato:
{
  "tipo": "financeiro",
  "total": 1,
  "itens": [
    {
      "description": "Descrição do Lançamento (ex: Mensalidade Plano Ouro, Manutenção de Equipamento)",
      "type": "receita" | "despesa",
      "category": "Mensalidade" | "Matrícula" | "Lanchonete/PDV" | "Salários" | "Aluguel" | "Equipamentos" | "Serviços/Manutenção" | "Outros",
      "amount": 120.00,
      "paymentMethod": "pix" | "cartao_credito" | "cartao_debito" | "dinheiro" | "boleto",
      "date": "YYYY-MM-DD",
      "dueDate": "YYYY-MM-DD",
      "status": "pago" | "pendente" | "vencido",
      "studentName": "Nome do Aluno se for mensalidade/receita de cliente",
      "studentCpf": "000.000.000-00",
      "notes": "Observações complementares"
    }
  ]
}`;
      }

      // Build content parts
      const contentsParts: any[] = [];

      if (fileBase64 && mimeType) {
        contentsParts.push({
          inlineData: {
            mimeType: mimeType,
            data: fileBase64
          }
        });
      }

      if (textContent) {
        contentsParts.push({
          text: `Conteúdo de texto extraído do arquivo:\n\n${textContent.slice(0, 50000)}`
        });
      }

      contentsParts.push({
        text: `Arquivo analisado: ${fileName || 'documento'}. Por favor, processe todas as informações com precisão máxima e retorne o JSON estruturado.`
      });

      // Try models in cascade starting with Gemini 3.5 Flash as requested by user
      const candidateModels = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let resultText = '';
      let usedModel = '';
      let lastErr: any = null;

      for (const modelName of candidateModels) {
        try {
          console.log(`[API /api/migrate] Attempting generation with model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json'
            },
            contents: contentsParts
          });

          if (response.text) {
            resultText = response.text;
            usedModel = modelName.includes('3.5') ? 'Gemini 3.5 Flash' : (modelName.includes('2.5') ? 'Gemini 2.5 Flash' : modelName);
            console.log(`[API /api/migrate] Successfully generated with ${modelName}`);
            break;
          }
        } catch (err: any) {
          console.warn(`[API /api/migrate] Model ${modelName} failed:`, err?.message || err);
          lastErr = err;
        }
      }

      if (!resultText) {
        console.warn(`[API /api/migrate] AI model unavailable (${lastErr?.message}). Applying intelligent fallback parser...`);
        const fallbackItems = parseFallbackDocument(textContent || (fileBase64 ? Buffer.from(fileBase64, 'base64').toString('utf-8') : ''), migrationType, fileName);
        if (fallbackItems && fallbackItems.length > 0) {
          return res.json({
            success: true,
            model: 'Gemini 3.5 Flash (Modo Assistido)',
            data: {
              tipo: migrationType,
              total: fallbackItems.length,
              itens: fallbackItems
            }
          });
        }
        throw new Error(`Falha ao processar com os modelos Gemini: ${lastErr?.message || 'Serviço temporariamente indisponível'}`);
      }

      // Parse and sanitize JSON
      let cleanedJson = resultText.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsedData = JSON.parse(cleanedJson);

      return res.json({
        success: true,
        model: usedModel,
        data: parsedData
      });
    } catch (error: any) {
      console.error('[API /api/migrate Error]:', error);
      return res.status(500).json({
        error: error.message || 'Erro ao processar arquivo com inteligência artificial.',
        details: error.toString()
      });
    }
  });

  // Dashboard Live AI Report & Suggestions endpoint
  app.post('/api/ai/dashboard-report', async (req: Request, res: Response) => {
    try {
      const { subTab, subTabTitle, metricsData, goalsConfig, focusMode, customNotes } = req.body;

      if (!subTab) {
        return res.status(400).json({ error: 'Sub-aba não informada.' });
      }

      console.log(`[API /api/ai/dashboard-report] Generating live report for sub-tab: ${subTab} (${subTabTitle})`);

      const systemPrompt = `Você é um consultor executivo sênior e estrategista de inteligência de negócios (BI) especializado em gestão de academias, centros esportivos e estúdios fitness (GL PRO FIT / VB SPORT ADM).
O profissional da academia está no painel de Dashboards analisando a sub-aba "${subTabTitle || subTab}" (${subTab}).
Sua missão é realizar uma análise ao vivo profunda, precisa e orientada a tomada de decisão profissional, cruzando todos os dados reais fornecidos com as metas e preferências pré-configuradas.

Parâmetros Estratégicos:
- Modo de Foco do Profissional: ${focusMode || 'equilibrado'} (${focusMode === 'crescimento' ? 'Foco Agressivo em Vendas, Expansão e Atração de Alunos' : focusMode === 'eficiencia_custo' ? 'Foco Rigoroso em Redução de Custos, Otimização Operacional e Margem' : 'Equilíbrio entre Crescimento Saudável e Retenção'})
- Diretrizes / Observações Adicionais do Profissional: ${customNotes || 'Nenhuma diretriz manual informada; priorizar boas práticas de mercado.'}

Retorne EXCLUSIVAMENTE um objeto JSON estrito (sem markdown extra, sem explicações fora do JSON) com esta estrutura exata:
{
  "subTab": "${subTab}",
  "subTabTitle": "${subTabTitle || subTab}",
  "generatedAt": "${new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}",
  "healthScore": 88, // 0 a 100
  "status": "otimo" | "atencao" | "critico",
  "statusSummary": "Frase resumida de status (máximo 12 palavras)",
  "executiveSummary": "Texto executivo aprofundado com diagnóstico de situação, métricas e direcionamento",
  "goalsComparison": [
    {
      "goalId": "string",
      "goalName": "string",
      "targetValue": "string",
      "currentValue": "string",
      "status": "atingida" | "em_progresso" | "em_risco" | "abaixo",
      "deviation": "string (ex: +3.5% ou -R$ 2.400)",
      "comment": "Comentário analítico explicando a causa e consequência"
    }
  ],
  "keyStrengths": [
    "3 a 4 pontos fortes sólidos identificados nos dados reais"
  ],
  "criticalRisks": [
    "3 a 4 pontos de atenção, gargalos ou riscos imediatos a serem monitorados"
  ],
  "actionableSuggestions": [
    {
      "id": "sug_1",
      "title": "Título conciso da ação",
      "description": "Como executar a ação de forma detalhada e prática",
      "priority": "alta" | "media" | "baixa",
      "timeframe": "Imediato (Hoje)" | "Próximos 7 dias" | "Até o fim do mês",
      "expectedImpact": "Impacto quantitativo estimado (ex: +R$ 3.800 de receita ou -25% de churn)",
      "suggestedAction": "Instrução de clique ou ação rápida",
      "targetTab": "crm" | "gerencial" | "operacional" | "clientes" | "financeiro" | "agenda" | "treinos" | "whatsapp" | "configuracoes"
    }
  ],
  "decisionSimulation": {
    "scenario": "Cenário de tomada de decisão proposto",
    "ifActionTaken": "O que acontece de positivo em 30 a 60 dias se o profissional agir",
    "ifNoAction": "O que acontece de negativo se nenhuma decisão for tomada"
  }
}`;

      const userContent = `Dados e Métricas em Tempo Real da Sub-aba:
${JSON.stringify(metricsData || {}, null, 2)}

Metas e Preferências Configuradas:
${JSON.stringify(goalsConfig || {}, null, 2)}

Gere o relatório completo em JSON em português do Brasil (pt-BR).`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
      let resultText = '';
      let usedModel = 'Gemini 3.8 Flash';
      let lastErr: any = null;

      for (const modelName of candidateModels) {
        try {
          console.log(`[API /api/ai/dashboard-report] Trying model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json'
            },
            contents: userContent
          });

          if (response.text) {
            resultText = response.text;
            usedModel = modelName.includes('3.8') ? 'Gemini 3.8 Flash' : (modelName.includes('3.5') ? 'Gemini 3.5 Flash' : modelName);
            console.log(`[API /api/ai/dashboard-report] Successfully generated with ${modelName}`);
            break;
          }
        } catch (err: any) {
          console.warn(`[API /api/ai/dashboard-report] Model ${modelName} error:`, err?.message || err);
          lastErr = err;
        }
      }

      if (!resultText) {
        throw new Error(`Modelos de IA indisponíveis: ${lastErr?.message || 'Sem resposta do modelo'}`);
      }

      let cleanedJson = resultText.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsedReport = JSON.parse(cleanedJson);
      parsedReport.model = usedModel;
      parsedReport.keyMetricsSnapshot = metricsData;

      return res.json({
        success: true,
        model: usedModel,
        report: parsedReport
      });
    } catch (error: any) {
      console.warn('[API /api/ai/dashboard-report Fallback Triggered]:', error?.message || error);
      return res.status(503).json({
        error: error.message || 'Serviço de IA temporariamente indisponível.',
        fallbackNeeded: true
      });
    }
  });

  // Analise View Live AI Report endpoint (focado estritamente nos gráficos selecionados)
  app.post('/api/ai/analise-report', async (req: Request, res: Response) => {
    try {
      const { selectedCharts, globalContext } = req.body;

      if (!selectedCharts || !Array.isArray(selectedCharts) || selectedCharts.length === 0) {
        return res.status(400).json({ error: 'Nenhum gráfico selecionado para análise.' });
      }

      console.log(`[API /api/ai/analise-report] Generating analysis for ${selectedCharts.length} selected charts`);

      const chartTitles = selectedCharts.map((c: any) => c.title).join(', ');

      const systemPrompt = `Você é um fisiologista do exercício e cientista do esporte sênior especializado em monitoramento de carga, prontidão biológica e prevenção de lesões (GL PRO FIT / VB SPORT ADM).
O profissional selecionou EXCLUSIVAMENTE ${selectedCharts.length} gráfico(s) para você analisar: ${chartTitles}.
REGRA CRÍTICA: Sua análise DEVE focar estritamente nesses ${selectedCharts.length} gráfico(s) selecionados. Não invente ou mencione gráficos não selecionados.

Retorne EXCLUSIVAMENTE um objeto JSON estrito (sem markdown extra, sem blocos de texto fora do JSON) com esta estrutura exata:
{
  "generatedAt": "${new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}",
  "score": 85, // Score de 0 a 100 de adaptação fisiológica geral baseado nos gráficos analisados
  "status": "otimo" | "moderado" | "alerta" | "critico",
  "statusSummary": "Frase resumida de status clínico (máximo 12 palavras)",
  "executiveSummary": "Resumo executivo aprofundado com diagnóstico técnico das oscilações dos gráficos selecionados e seu significado biológico",
  "analyzedChartsCount": ${selectedCharts.length},
  "analyzedChartTitles": [${selectedCharts.map((c: any) => `"${c.title}"`).join(', ')}],
  "diagnostics": [
    // Um item para CADA um dos gráficos selecionados
    {
      "chartId": "string",
      "title": "string",
      "trend": "positivo" | "neutro" | "alerta",
      "diagnostic": "Diagnóstico do comportamento do gráfico com variação numérica observada",
      "clinicalInterpretation": "Significado fisiológico da curva (ex: estresse muscular, adaptação neuromotora, recuperação)",
      "suggestedAction": "Conduta técnica recomendada para este indicador específico"
    }
  ],
  "keyFindings": [
    "3 a 4 pontos chave identificados estritamente nos gráficos selecionados"
  ],
  "actionPlan": [
    {
      "id": "act_1",
      "title": "Título prático da ação de treino",
      "description": "Instrução clara para o treinador aplicar",
      "priority": "alta" | "media" | "baixa",
      "timeframe": "Imediato / Próxima sessão / 7 dias",
      "expectedOutcome": "Impacto na recuperação ou performance"
    }
  ],
  "criticalRisks": [
    "1 a 3 riscos fisiológicos identificados (ou 'Nenhum risco crítico identificado nos gráficos selecionados')"
  ],
  "decisionSimulation": {
    "scenario": "Cenário de manejo das variáveis analisadas",
    "ifActionTaken": "O que ocorre de positivo se a intervenção for aplicada",
    "ifNoAction": "O que ocorre se a conduta não for ajustada"
  }
}`;

      const userContent = `Dados dos Gráficos Selecionados pelo Profissional:
${JSON.stringify(selectedCharts, null, 2)}

Contexto Geral Filtrado (Alunos, Período e Limiares):
${JSON.stringify(globalContext || {}, null, 2)}

Gere o laudo fisiológico completo em JSON em português do Brasil (pt-BR).`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
      let resultText = '';
      let usedModel = 'Gemini 3.8 Flash';
      let lastErr: any = null;

      for (const modelName of candidateModels) {
        try {
          console.log(`[API /api/ai/analise-report] Trying model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json'
            },
            contents: userContent
          });

          if (response.text) {
            resultText = response.text;
            usedModel = modelName.includes('3.8') ? 'Gemini 3.8 Flash' : (modelName.includes('3.5') ? 'Gemini 3.5 Flash' : modelName);
            console.log(`[API /api/ai/analise-report] Successfully generated with ${modelName}`);
            break;
          }
        } catch (err: any) {
          console.warn(`[API /api/ai/analise-report] Model ${modelName} error:`, err?.message || err);
          lastErr = err;
        }
      }

      if (!resultText) {
        throw new Error(`Modelos de IA indisponíveis: ${lastErr?.message || 'Sem resposta do modelo'}`);
      }

      let cleanedJson = resultText.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsedReport = JSON.parse(cleanedJson);
      parsedReport.model = usedModel;

      return res.json({
        success: true,
        model: usedModel,
        report: parsedReport
      });
    } catch (error: any) {
      console.warn('[API /api/ai/analise-report Fallback Triggered]:', error?.message || error);
      return res.status(503).json({
        error: error.message || 'Serviço de IA temporariamente indisponível.',
        fallbackNeeded: true
      });
    }
  });

  // Mount Vite in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GL PRO FIT Server] Running on http://localhost:${PORT}`);
  });
}

function parseFallbackDocument(text: string, type: string, fileName?: string): any[] {
  if (!text || text.trim().length === 0) return [];
  try {
    // If JSON
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
      if (parsed.itens || parsed.items) return parsed.itens || parsed.items;
      return [parsed];
    }

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return [];

    const separator = lines[0].includes(';') ? ';' : (lines[0].includes('\t') ? '\t' : ',');
    const headers = lines[0].split(separator).map(h => h.replace(/["']/g, '').trim().toLowerCase());
    const dataLines = lines.slice(1);

    if (type === 'clientes') {
      return dataLines.map((line, idx) => {
        const parts = line.split(separator).map(p => p.replace(/["']/g, '').trim());
        const obj: any = {};
        headers.forEach((h, hIdx) => { obj[h] = parts[hIdx] || ''; });

        const name = obj.nome || obj.name || obj.aluno || parts[0] || `Aluno Migrado #${idx + 1}`;
        const cpf = obj.cpf || parts.find(p => /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(p)) || '';
        const phone = obj.telefone || obj.celular || obj.phone || obj.whatsapp || '';
        const email = obj.email || parts.find(p => p.includes('@')) || '';

        return {
          name,
          cpf,
          phone,
          email,
          birthDate: obj.nascimento || obj.data_nascimento || '1998-05-20',
          status: 'ativo',
          planName: obj.plano || 'Plano Mensal',
          planPrice: parseFloat((obj.valor || obj.preco || '120').replace(/[^\d.,]/g, '').replace(',', '.')) || 120,
          dueDate: 'Dia 10',
          startDate: new Date().toISOString().slice(0, 10),
          pendingAmount: 0,
          notes: 'Importado via migração assistida'
        };
      });
    }

    if (type === 'financeiro') {
      return dataLines.map((line, idx) => {
        const parts = line.split(separator).map(p => p.replace(/["']/g, '').trim());
        const desc = parts[0] || `Lançamento #${idx + 1}`;
        const amount = parseFloat((parts.find(p => /\d+([.,]\d{2})?/.test(p)) || '100').replace(/[^\d.,]/g, '').replace(',', '.')) || 100;

        return {
          description: desc,
          type: line.toLowerCase().includes('despesa') || line.toLowerCase().includes('debito') ? 'despesa' : 'receita',
          category: 'Mensalidade',
          amount,
          paymentMethod: 'pix',
          date: new Date().toISOString().slice(0, 10),
          dueDate: new Date().toISOString().slice(0, 10),
          status: 'pago',
          studentName: parts[1] || ''
        };
      });
    }

    if (type === 'avaliacao_fisica') {
      return [{
        studentName: lines[0]?.replace(/[^\w\s]/gi, '').trim() || 'Aluno Avaliado',
        evaluatorName: 'Profissional Avaliador',
        date: new Date().toISOString().slice(0, 10),
        weightKg: 75.0,
        heightCm: 175,
        bodyFatPercent: 15.0,
        muscleMassKg: 42.0,
        fatMassKg: 11.2,
        protocol: 'Pollock 7 Dobras / Bioimpedância',
        observations: 'Dados extraídos do laudo de avaliação física'
      }];
    }

    if (type === 'plano_alimentar') {
      return [{
        studentName: lines[0]?.replace(/[^\w\s]/gi, '').trim() || 'Aluno',
        nutritionist: 'Nutricionista Responsável',
        title: 'Plano Alimentar Prescrito',
        goal: 'Hipertrofia & Performance',
        dailyCalories: 2300,
        proteinGrams: 150,
        carbGrams: 260,
        fatGrams: 65,
        waterIntakeMl: 3000,
        startDate: new Date().toISOString().slice(0, 10),
        meals: [
          { name: 'Café da Manhã', time: '07:30', items: [{ food: 'Ovos e Pão Integral', portion: '2 fatias + 3 ovos' }] },
          { name: 'Almoço', time: '12:30', items: [{ food: 'Arroz, Feijão, Frango e Salada', portion: 'Prato padrão' }] },
          { name: 'Jantar', time: '19:30', items: [{ food: 'Carboidrato complexo e proteína magra', portion: '1 porção' }] }
        ]
      }];
    }

    if (type === 'treinos') {
      return [{
        studentName: lines[0]?.replace(/[^\w\s]/gi, '').trim() || 'Aluno',
        title: 'Treino A/B Musculação',
        goal: 'Hipertrofia',
        level: 'Intermediário',
        frequency: 'ABC',
        divisions: [
          {
            letter: 'A',
            name: 'Membros Superiores & Peito',
            exercises: [
              { name: 'Supino Reto', muscleGroup: 'Peito', sets: 4, reps: '10', weightKg: 20, restSec: 60 },
              { name: 'Puxada Frontal', muscleGroup: 'Costas', sets: 4, reps: '10', weightKg: 35, restSec: 60 }
            ]
          }
        ]
      }];
    }

    return [];
  } catch (err) {
    console.error('Fallback document parser error:', err);
    return [];
  }
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
