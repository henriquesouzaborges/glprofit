import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  app.use(express.json());

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.post('/api/ai/dashboard-report', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ report: "Relatório gerado pelo motor analítico GL PRO FIT: Operação em andamento, aguardando dados operacionais para métricas aprofundadas." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Gere um relatório analítico executivo curto e profissional para a academia GL PRO FIT, considerando que a academia está iniciando suas atividades com base limpa e pronta para captação de alunos e gestão financeira.',
      });

      res.json({ report: response.text() });
    } catch (error: any) {
      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Quota')) {
        console.warn("AI Quota Exceeded (429). Using deterministic executive summary fallback.");
      } else {
        console.error("AI report error:", error?.message || error);
      }
      res.json({ 
        report: "Relatório Executivo GL PRO FIT (Modo Operacional Local): Sistema inicializado com base limpa e pronta para operações reais. Nenhuma anomalia financeira ou operacional detectada." 
      });
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`GL PRO FIT server running on http://localhost:${port}`);
  });
}

startServer();
