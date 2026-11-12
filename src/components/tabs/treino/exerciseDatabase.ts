import { ExerciseCatalogItem, WorkoutTemplate } from '../../../types';
import { FULL_EXERCISE_CATALOG } from './fullExerciseCatalog';

const CORE_SIGNATURE_EXERCISES: ExerciseCatalogItem[] = [
  // PEITORAL
  {
    id: 'cat-peito-1',
    name: 'Supino Reto com Barra Olímpica',
    muscleGroup: 'Peito',
    equipment: 'Barra',
    difficulty: 'Intermediário',
    primaryMuscle: 'Peitoral Maior (Fibras Esternais)',
    secondaryMuscles: ['Tríceps Braquial', 'Deltoide Anterior'],
    instructions: [
      'Deite-se no banco com os olhos alinhados à barra.',
      'Pegada ligeiramente mais aberta que a largura dos ombros.',
      'Abaixe a barra de forma controlada até tocar a linha dos mamilos.',
      'Empurre a barra em linha reta até a extensão quase total dos braços sem travar os cotovelos.'
    ],
    tips: 'Mantenha as escápulas aduzidas e os pés firmes no chão gerando leg drive.'
  },
  {
    id: 'cat-peito-2',
    name: 'Supino Inclinado com Halteres',
    muscleGroup: 'Peito',
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    primaryMuscle: 'Peitoral Maior (Fibras Claviculares / Superior)',
    secondaryMuscles: ['Deltoide Anterior', 'Tríceps'],
    instructions: [
      'Ajuste o banco em inclinação de 30° a 45°.',
      'Segure os halteres na altura do peito superior.',
      'Empurre os halteres para cima aproximando-os no topo sem bater.',
      'Desça de forma cadenciada sentindo o alongamento do peitoral superior.'
    ],
    tips: 'Evite inclinações acima de 45° para não transferir a sobrecarga excessivamente aos deltoides.'
  },
  {
    id: 'cat-peito-3',
    name: 'Crucifixo / Crossover na Polia Média',
    muscleGroup: 'Peito',
    equipment: 'Cabos/Polia',
    difficulty: 'Iniciante',
    primaryMuscle: 'Peitoral Maior (Adução Horizontal)',
    secondaryMuscles: ['Deltoide Anterior'],
    instructions: [
      'Posicione as polias na altura média do peitoral.',
      'Dê um passo à frente com leve flexão do tronco e dos cotovelos.',
      'Feche os braços em arco apertando o peito no ponto de contração máxima.',
      'Retorne lentamente resistindo ao peso da polia.'
    ],
    tips: 'Segure 1 a 2 segundos na contração máxima de pico.'
  },
  {
    id: 'cat-peito-4',
    name: 'Supino Declinado com Barra',
    muscleGroup: 'Peito',
    equipment: 'Barra',
    difficulty: 'Intermediário',
    primaryMuscle: 'Peitoral Maior (Fibras Inferiores)',
    secondaryMuscles: ['Tríceps', 'Deltoide Anterior'],
    instructions: [
      'Fixe as pernas no apoio do banco declinado.',
      'Desça a barra controladamente até a base do esterno.',
      'Empurre na vertical mantendo estabilidade no tronco.'
    ],
    tips: 'Excelente para contorno inferior e volume denso do peitoral.'
  },
  {
    id: 'cat-peito-5',
    name: 'Voador / Pec Deck na Máquina',
    muscleGroup: 'Peito',
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    primaryMuscle: 'Peitoral Maior',
    secondaryMuscles: ['Deltoide Anterior'],
    instructions: [
      'Ajuste o assento para que os braços fiquem alinhados com o peito.',
      'Feche os braços contraindo o peitoral com força.',
      'Abra controladamente até sentir o alongamento peitoral.'
    ],
    tips: 'Mantenha os cotovelos levemente flexionados durante todo o percurso.'
  },
  {
    id: 'cat-peito-6',
    name: 'Flexão de Braços no Solo (Push-up)',
    muscleGroup: 'Peito',
    equipment: 'Peso Corporal',
    difficulty: 'Iniciante',
    primaryMuscle: 'Peitoral Maior',
    secondaryMuscles: ['Core / Abdômen', 'Tríceps', 'Deltoides'],
    instructions: [
      'Posicione as mãos um pouco além da largura dos ombros.',
      'Corpo em prancha reta da cabeça aos calcanhares.',
      'Desça o peito até quase encostar no chão e empurre.'
    ],
    tips: 'Evite hiperlordose na lombar; mantenha glúteos e abdômen firmemente contraídos.'
  },

  // DORSAIS / COSTAS
  {
    id: 'cat-costas-1',
    name: 'Puxada Frontal Aberta no Pulley',
    muscleGroup: 'Costas',
    equipment: 'Cabos/Polia',
    difficulty: 'Iniciante',
    primaryMuscle: 'Latíssimo do Dorso (Grande Dorsal)',
    secondaryMuscles: ['Bíceps Braquial', 'Redondo Maior', 'Romboides'],
    instructions: [
      'Sente-se com as coxas fixas sob os apoios.',
      'Pegada pronada com as mãos além dos ombros.',
      'Inicie o movimento deprimindo as escápulas e puxe a barra até a clavícula.',
      'Retorne estendendo totalmente os braços para alongar os dorsais.'
    ],
    tips: 'Pense em puxar com os cotovelos para baixo, não com as mãos.'
  },
  {
    id: 'cat-costas-2',
    name: 'Remada Curvada com Barra (Pronada)',
    muscleGroup: 'Costas',
    equipment: 'Barra',
    difficulty: 'Avançado',
    primaryMuscle: 'Latíssimo do Dorso, Romboides e Trapézio Médio',
    secondaryMuscles: ['Eretores da Espinha', 'Bíceps', 'Deltoide Posterior'],
    instructions: [
      'Incline o tronco à frente a 45° mantendo a coluna neutra e joelhos semi-flexionados.',
      'Puxe a barra em direção ao umbigo aproximando as escápulas.',
      'Desça com controle mantendo a postura firme sem arredondar as costas.'
    ],
    tips: 'Fundamental manter o abdômen travado com bracing respiratório.'
  },
  {
    id: 'cat-costas-3',
    name: 'Remada Baixa no Triângulo (Polia Sentada)',
    muscleGroup: 'Costas',
    equipment: 'Cabos/Polia',
    difficulty: 'Iniciante',
    primaryMuscle: 'Latíssimo do Dorso e Miolo das Costas',
    secondaryMuscles: ['Bíceps', 'Deltoide Posterior'],
    instructions: [
      'Sente-se com joelhos ligeiramente flexionados e tronco ereto.',
      'Puxe o triângulo contra o abdômen retraindo as escápulas.',
      'Retorne estendendo os braços com tronco estável.'
    ],
    tips: 'Não use impulso balançando o tronco para trás.'
  },
  {
    id: 'cat-costas-4',
    name: 'Barra Fixa Pronada (Pull-up)',
    muscleGroup: 'Costas',
    equipment: 'Peso Corporal',
    difficulty: 'Avançado',
    primaryMuscle: 'Grande Dorsal',
    secondaryMuscles: ['Bíceps', 'Braquial', 'Core'],
    instructions: [
      'Segure na barra fixa com pegada pronada aberta.',
      'Eleve o corpo até o queixo passar da linha da barra.',
      'Desça de forma controlada sem se soltar bruscamente.'
    ],
    tips: 'Se necessário, utilize elástico auxiliar ou gravíton para iniciantes.'
  },
  {
    id: 'cat-costas-5',
    name: 'Levantamento Terra Clássico (Deadlift)',
    muscleGroup: 'Costas',
    equipment: 'Barra',
    difficulty: 'Avançado',
    primaryMuscle: 'Cadeia Posterior Completa & Eretores da Coluna',
    secondaryMuscles: ['Glúteos', 'Isquiotibiais', 'Trapézio', 'Antebraço'],
    instructions: [
      'Pés na largura do quadril, barra próxima às canelas.',
      'Pegue a barra, peito estufado, coluna alinhada.',
      'Estenda quadril e joelhos simultaneamente mantendo a barra colada ao corpo.',
      'Finalize em pé com postura ereta sem hiperestender a lombar.'
    ],
    tips: 'Excelente exercício composto para densidade e força global.'
  },

  // OMBROS / DELTOIDES
  {
    id: 'cat-ombro-1',
    name: 'Desenvolvimento com Halteres Sentado',
    muscleGroup: 'Ombros',
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    primaryMuscle: 'Deltoide Anterior e Lateral',
    secondaryMuscles: ['Tríceps', 'Trapézio Superior'],
    instructions: [
      'Sente-se em banco a 75-80° com as costas apoiadas.',
      'Eleve os halteres na altura das orelhas com cotovelos a 90°.',
      'Empurre para cima estendendo os braços.',
      'Desça com controle até a linha das orelhas.'
    ],
    tips: 'Evite bater os halteres no topo; mantenha a tensão contínua.'
  },
  {
    id: 'cat-ombro-2',
    name: 'Elevação Lateral com Halteres',
    muscleGroup: 'Ombros',
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    primaryMuscle: 'Deltoide Lateral (Porção Média)',
    secondaryMuscles: ['Trapézio'],
    instructions: [
      'Em pé, pés paralelos, leve inclinação do tronco para frente.',
      'Eleve os halteres lateralmente até a linha dos ombros.',
      'Cotovelos levemente flexionados liderando o movimento.',
      'Desça em 2 segundos sem descansar embaixo.'
    ],
    tips: 'Não jogue o tronco para cima; foque na abdução pura do ombro.'
  },
  {
    id: 'cat-ombro-3',
    name: 'Crucifixo Inverso no Cabo ou Halteres',
    muscleGroup: 'Ombros',
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    primaryMuscle: 'Deltoide Posterior',
    secondaryMuscles: ['Romboides', 'Trapézio Médio'],
    instructions: [
      'Tronco inclinado para frente a quase 90° ou sentado no banco inclinado.',
      'Abra os braços lateralmente puxando com a parte de trás do ombro.',
      'Segure 1 segundo e desça com suavidade.'
    ],
    tips: 'Crucial para correção postural e equilíbrio articular do ombro.'
  },
  {
    id: 'cat-ombro-4',
    name: 'Elevação Frontal com Halteres / Anilha',
    muscleGroup: 'Ombros',
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    primaryMuscle: 'Deltoide Anterior',
    secondaryMuscles: ['Peitoral Clavicular'],
    instructions: [
      'Eleve os braços à frente até a linha dos olhos.',
      'Desça de maneira controlada sem balançar o quadril.'
    ],
    tips: 'Alternar os braços ajuda a concentrar a execução.'
  },

  // BRAÇOS / BÍCEPS & TRÍCEPS
  {
    id: 'cat-braco-1',
    name: 'Rosca Direta com Barra W',
    muscleGroup: 'Braços',
    equipment: 'Barra',
    difficulty: 'Iniciante',
    primaryMuscle: 'Bíceps Braquial',
    secondaryMuscles: ['Braquiorradial', 'Braquial'],
    instructions: [
      'Em pé, pegada supinada na curvatura da barra W.',
      'Cotovelos colados às costelas.',
      'Flexione os antebraços erguendo a barra sem mover os cotovelos para frente.',
      'Estenda quase totalmente para amplitude completa.'
    ],
    tips: 'A barra W diminui a sobrecarga nos punhos e antebraços.'
  },
  {
    id: 'cat-braco-2',
    name: 'Rosca Martelo Alternada com Halteres',
    muscleGroup: 'Braços',
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    primaryMuscle: 'Braquial e Braquiorradial (Largura do Braço)',
    secondaryMuscles: ['Bíceps Braquial'],
    instructions: [
      'Pegada neutra (palmas das mãos voltadas uma para a outra).',
      'Eleve o halter mantendo a pegada firme.',
      'Desça controlando a fase excêntrica.'
    ],
    tips: 'Excelente para ganho de espessura e força no antebraço.'
  },
  {
    id: 'cat-braco-3',
    name: 'Rosca Scott na Máquina ou Banco',
    muscleGroup: 'Braços',
    equipment: 'Máquina',
    difficulty: 'Intermediário',
    primaryMuscle: 'Bíceps Braquial (Cabeça Curta / Pico)',
    secondaryMuscles: ['Braquial'],
    instructions: [
      'Apoie os braços e o peito firmemente no estofado inclinado.',
      'Faça a flexão completa do bíceps.',
      'Não hiperestenda totalmente os cotovelos ao final para proteger a articulação.'
    ],
    tips: 'Isola completamente o bíceps eliminando qualquer compensação do corpo.'
  },
  {
    id: 'cat-braco-4',
    name: 'Tríceps Pulley com Corda',
    muscleGroup: 'Braços',
    equipment: 'Cabos/Polia',
    difficulty: 'Iniciante',
    primaryMuscle: 'Tríceps Braquial (Cabeça Lateral)',
    secondaryMuscles: ['Cabeça Medial e Longa'],
    instructions: [
      'Fixe a corda na polia alta.',
      'Cotovelos fixos ao lado do tronco.',
      'Puxe a corda para baixo abrindo as pontas no final do movimento.',
      'Retorne até formar um ângulo de 90° nos cotovelos.'
    ],
    tips: 'A abertura no final enfatiza a contração máxima da cabeça lateral.'
  },
  {
    id: 'cat-braco-5',
    name: 'Tríceps Testa com Barra W ou Halteres',
    muscleGroup: 'Braços',
    equipment: 'Barra',
    difficulty: 'Intermediário',
    primaryMuscle: 'Tríceps Braquial (Cabeça Longa)',
    secondaryMuscles: ['Cabeça Medial'],
    instructions: [
      'Deite-se no banco reto com a barra estendida acima do peito.',
      'Flexione apenas os antebraços descendo a barra em direção à testa.',
      'Empurre estendendo os cotovelos com foco no tríceps.'
    ],
    tips: 'Mantenha os cotovelos apontados para o teto sem deixá-los abrir.'
  },
  {
    id: 'cat-braco-6',
    name: 'Mergulho nas Barras Paralelas (Dips)',
    muscleGroup: 'Braços',
    equipment: 'Peso Corporal',
    difficulty: 'Avançado',
    primaryMuscle: 'Tríceps e Peitoral Inferior',
    secondaryMuscles: ['Deltoide Anterior'],
    instructions: [
      'Suspenda-se nas barras com os braços estendidos.',
      'Desça o corpo flexionando os cotovelos até 90° com corpo reto para tríceps.',
      'Empurre com potência de volta à posição inicial.'
    ],
    tips: 'Incline o tronco para focar mais em peito, mantenha reto para tríceps.'
  },

  // MEMBROS INFERIORES / PERNAS & GLÚTEOS
  {
    id: 'cat-perna-1',
    name: 'Agachamento Livre com Barra Olímpica',
    muscleGroup: 'Pernas',
    equipment: 'Barra',
    difficulty: 'Avançado',
    primaryMuscle: 'Quadríceps e Glúteo Máximo',
    secondaryMuscles: ['Isquiotibiais', 'Eretores da Coluna', 'Core'],
    instructions: [
      'Barra apoiada nos trapézios, pés na largura dos ombros.',
      'Inicie flexionando o quadril para trás e depois os joelhos.',
      'Desça até as coxas ficarem paralelas ao chão mantendo joelhos alinhados aos pés.',
      'Empurre o chão com os calcanhares para subir.'
    ],
    tips: 'O rei dos exercícios de inferiores; respiração com bracing é mandatória.'
  },
  {
    id: 'cat-perna-2',
    name: 'Leg Press 45° Articulado',
    muscleGroup: 'Pernas',
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    primaryMuscle: 'Quadríceps',
    secondaryMuscles: ['Glúteos', 'Panturrilhas'],
    instructions: [
      'Posicione os pés na plataforma na largura dos ombros.',
      'Destrave o equipamento e flexione os joelhos trazendo a carga até 90°.',
      'Empurre sem hiperestender ou estalar os joelhos no topo.'
    ],
    tips: 'Não tire a lombar nem o glúteo do encosto durante a descida.'
  },
  {
    id: 'cat-perna-3',
    name: 'Cadeira Extensora',
    muscleGroup: 'Pernas',
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    primaryMuscle: 'Quadríceps (Reto Femoral)',
    secondaryMuscles: ['Vasto Lateral, Intermédio e Medial'],
    instructions: [
      'Ajuste o rolo logo acima dos tornozelos e encosto para alinhar o joelho ao eixo.',
      'Estenda os joelhos até a contração total.',
      'Segure 1 segundo no topo e desça controladamente.'
    ],
    tips: 'Excelente para finalização e técnica de Drop-set.'
  },
  {
    id: 'cat-perna-4',
    name: 'Mesa Flexora (Deitado)',
    muscleGroup: 'Pernas',
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    primaryMuscle: 'Isquiotibiais (Posteriores de Coxa)',
    secondaryMuscles: ['Gastrocnêmio'],
    instructions: [
      'Deite-se de bruços com o rolo apoiado na panturrilha/calcanhar.',
      'Puxe os pés em direção ao glúteo flexionando os joelhos.',
      'Segure a contração e volte sem deixar o peso bater.'
    ],
    tips: 'Mantenha o quadril pressionado contra o banco para não compensar na lombar.'
  },
  {
    id: 'cat-perna-5',
    name: 'Stiff com Barra ou Halteres',
    muscleGroup: 'Pernas',
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    primaryMuscle: 'Isquiotibiais e Glúteo Máximo',
    secondaryMuscles: ['Eretores da Coluna'],
    instructions: [
      'Pés na largura do quadril, joelhos semi-flexionados fixos.',
      'Projete o quadril para trás mantendo a coluna retilínea.',
      'Desça os pesos colados às pernas até sentir o estiramento posterior.',
      'Retorne contraindo fortemente os glúteos.'
    ],
    tips: 'Não arredonde a coluna lombar; o movimento é guiado pelo quadril.'
  },
  {
    id: 'cat-perna-6',
    name: 'Elevação Pélvica com Barra / Hip Thrust',
    muscleGroup: 'Pernas',
    equipment: 'Barra',
    difficulty: 'Intermediário',
    primaryMuscle: 'Glúteo Máximo',
    secondaryMuscles: ['Isquiotibiais', 'Core'],
    instructions: [
      'Costas apoiadas no banco na altura das escápulas, barra sobre o quadril com acolchoamento.',
      'Pés no chão formando 90° com os joelhos no topo.',
      'Empurre o quadril para cima até alinhá-lo com o tronco.',
      'Contraia o glúteo no topo por 2 segundos e desça controlando.'
    ],
    tips: 'O exercício de maior ativação eletromiográfica para glúteos.'
  },
  {
    id: 'cat-perna-7',
    name: 'Cadeira Abdutora',
    muscleGroup: 'Pernas',
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    primaryMuscle: 'Glúteo Médio e Mínimo',
    secondaryMuscles: ['Tensor da Fáscia Lata'],
    instructions: [
      'Sente-se com as costas apoiadas ou levemente inclinadas para frente.',
      'Abra as pernas empurrando as almofadas até amplitude máxima.',
      'Retorne lentamente resistindo à carga.'
    ],
    tips: 'Inclinar o tronco à frente ativa fibras superiores do glúteo.'
  },
  {
    id: 'cat-perna-8',
    name: 'Gêmeos Sentado na Máquina (Panturrilha)',
    muscleGroup: 'Pernas',
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    primaryMuscle: 'Sóleo e Gastrocnêmio',
    secondaryMuscles: ['Tibial Posterior'],
    instructions: [
      'Ponta dos pés na base com calcanhares livres.',
      'Desça os calcanhares ao máximo para alongamento.',
      'Eleve na ponta dos pés com contração máxima.'
    ],
    tips: 'Segure 2 segundos na extensão máxima e desça em 3 segundos.'
  },

  // ABDÔMEN & CORE
  {
    id: 'cat-abdom-1',
    name: 'Abdominal Supra na Prancha Inclinada',
    muscleGroup: 'Abdômen',
    equipment: 'Peso Corporal',
    difficulty: 'Iniciante',
    primaryMuscle: 'Reto Abdominal (Porção Superior)',
    secondaryMuscles: ['Oblíquos'],
    instructions: [
      'Prenda os pés no apoio da prancha inclinada.',
      'Mãos ao lado da cabeça sem puxar o pescoço.',
      'Enrole o tronco aproximando as costelas do quadril.',
      'Desça mantendo a tensão contínua no abdômen.'
    ],
    tips: 'Concentre-se em curvar a coluna, não em flexionar o quadril.'
  },
  {
    id: 'cat-abdom-2',
    name: 'Elevação de Pernas na Barra Fixa / Paralela',
    muscleGroup: 'Abdômen',
    equipment: 'Peso Corporal',
    difficulty: 'Intermediário',
    primaryMuscle: 'Reto Abdominal (Porção Infra) e Core',
    secondaryMuscles: ['Flexores do Quadril', 'Oblíquos'],
    instructions: [
      'Suspenda-se na barra ou apoie os antebraços na paralela.',
      'Eleve os joelhos ou pernas estendidas até a altura do abdômen.',
      'Curve a bacia para cima no final do movimento para contração máxima.'
    ],
    tips: 'Controle a descida sem deixar o corpo balançar como pêndulo.'
  },
  {
    id: 'cat-abdom-3',
    name: 'Prancha Frontal Isométrica',
    muscleGroup: 'Abdômen',
    equipment: 'Peso Corporal',
    difficulty: 'Iniciante',
    primaryMuscle: 'Transverso do Abdômen e Reto Abdominal',
    secondaryMuscles: ['Glúteos', 'Ombros', 'Lombar'],
    instructions: [
      'Apoie os antebraços no chão alinhados aos ombros.',
      'Corpo reto dos calcanhares à cabeça.',
      'Mantenha a posição respirando ritmicamente.'
    ],
    tips: 'Mantenha o umbigo puxado para dentro ativando o transverso.'
  },

  // CÁRDIO & AERÓBICO
  {
    id: 'cat-cardio-1',
    name: 'Esteira Ergométrica (Corrida / Caminhada Inclinada)',
    muscleGroup: 'Cardio',
    equipment: 'Aparelho Cárdio',
    difficulty: 'Iniciante',
    primaryMuscle: 'Sistema Cardiorrespiratório',
    secondaryMuscles: ['Panturrilhas', 'Quadríceps', 'Glúteos'],
    instructions: [
      'Ajuste velocidade e inclinação conforme a zona de FC prescrita.',
      'Postura ereta sem segurar nas barras laterais durante corrida.'
    ],
    tips: 'Excelente para aquecimento articular ou treinamento HIIT/LISS.'
  },
  {
    id: 'cat-cardio-2',
    name: 'Bicicleta Ergométrica (Spinning / Air Bike)',
    muscleGroup: 'Cardio',
    equipment: 'Aparelho Cárdio',
    difficulty: 'Iniciante',
    primaryMuscle: 'Sistema Cardiorrespiratório e Quadríceps',
    secondaryMuscles: ['Isquiotibiais', 'Panturrilhas'],
    instructions: [
      'Ajuste a altura do selim na altura do quadril.',
      'Pedale mantendo cadência constante entre 80-100 RPM.'
    ],
    tips: 'Baixo impacto articular ideal para preservação de meniscos e joelhos.'
  }
];

export const FUTEBOL_EXERCISES: ExerciseCatalogItem[] = [
  {
    id: 'cat-fut-1',
    name: 'Passe Curto & Deslocamento em Y (Posse & Apoio)',
    muscleGroup: 'Futebol',
    equipment: 'Outro',
    difficulty: 'Iniciante',
    primaryMuscle: 'Adutores, Quadríceps e Coordenação Motora',
    secondaryMuscles: ['Panturrilhas', 'Core'],
    videoUrl: 'https://www.youtube.com/watch?v=soccer_pass_drill_1',
    instructions: [
      'Posicione três cones em formato de Y com distância de 8 metros entre eles.',
      'O atleta do vértice realiza o passe firme rasteiro com a chapa do pé dominante.',
      'Desloca-se em velocidade imediatamente para a ponta oposta para dar linha de passe.',
      'Recepção orientada com o pé oposto e devolução dinâmica de primeira.'
    ],
    tips: 'Manter a cabeça erguida e o corpo perfilado para a direção da jogada.'
  },
  {
    id: 'cat-fut-2',
    name: 'Condução em Zigue-Zague com Finalização a Gol',
    muscleGroup: 'Futebol',
    equipment: 'Outro',
    difficulty: 'Intermediário',
    primaryMuscle: 'Controle de Bola, Mudança de Direção e Quadríceps',
    secondaryMuscles: ['Glúteos', 'Panturrilhas'],
    videoUrl: 'https://www.youtube.com/watch?v=soccer_slalom_shooting',
    instructions: [
      'Disponha 6 cones em linha com 1.5 metros de intervalo.',
      'Conduza a bola em velocidade utilizando a parte externa e interna do pé.',
      'Na saída do último cone, acelere o passo para o espaço vazio.',
      'Finalize com o peito do pé ou chute colocado visando os cantos da trave.'
    ],
    tips: 'Passos curtos e centro de gravidade rebaixado para maior estabilidade nas curvas.'
  },
  {
    id: 'cat-fut-3',
    name: 'Rondo 4v2 (Bobinho com Transição Rápida e Pressão)',
    muscleGroup: 'Futebol',
    equipment: 'Outro',
    difficulty: 'Intermediário',
    primaryMuscle: 'Tomada de Decisão, Agilidade e Resistência Anaeróbia',
    secondaryMuscles: ['Core', 'Quadríceps'],
    videoUrl: 'https://www.youtube.com/watch?v=soccer_rondo_4v2',
    instructions: [
      'Delimite um quadrante de 10x10 metros com 4 jogadores nas bordas e 2 no centro.',
      'Os 4 jogadores circulam a bola com no máximo 2 toques buscando passes verticais.',
      'Os 2 defensores pressionam a bola fechando as linhas de passe.',
      'Quem errar o passe ou perder a bola troca de função e entra na marcação.'
    ],
    tips: 'Foco na comunicação verbal e velocidade da circulação de bola.'
  },
  {
    id: 'cat-fut-4',
    name: 'Cruzamento Lateral com Finalização de Primeira',
    muscleGroup: 'Futebol',
    equipment: 'Outro',
    difficulty: 'Intermediário',
    primaryMuscle: 'Potência de Chute, Tempo de Bola e Membros Inferiores',
    secondaryMuscles: ['Dorsais', 'Abdômen'],
    videoUrl: 'https://www.youtube.com/watch?v=soccer_crossing_drill',
    instructions: [
      'O ala avança em velocidade até a linha de fundo da grande área.',
      'Executa o cruzamento tenso entre a linha de zaga e o goleiro.',
      'Dois atacantes entram em facão atacando o primeiro e o segundo pau.',
      'Finalização com pé ou cabeceio firme sem dominar a bola.'
    ],
    tips: 'Sincronizar a arrancada do atacante para não entrar em impedimento.'
  },
  {
    id: 'cat-fut-5',
    name: 'Drible 1v1 com Transição Ofensiva e Defensiva',
    muscleGroup: 'Futebol',
    equipment: 'Outro',
    difficulty: 'Avançado',
    primaryMuscle: 'Força Explosiva, Drible e Estabilização Articular',
    secondaryMuscles: ['Isquiotibiais', 'Adutores'],
    videoUrl: 'https://www.youtube.com/watch?v=soccer_1v1_finishing',
    instructions: [
      'Atacante parte com a posse a 20 metros do gol contra 1 zagueiro direto.',
      'Utiliza fintas de corpo, pedalada ou mudança brusca de ritmo para ultrapassar.',
      'Limite de 6 segundos para finalizar antes do retorno de cobertura.',
      'Caso a defesa desarme, contra-ataque rápido em minigols laterais.'
    ],
    tips: 'Explorar o pé fraco do defensor e atacar o espaço vazio.'
  },
  {
    id: 'cat-fut-6',
    name: 'Circuito Físico-Técnico: Agilidade, Salto e Chute',
    muscleGroup: 'Futebol',
    equipment: 'Outro',
    difficulty: 'Avançado',
    primaryMuscle: 'Pliometria, Força Reativa e Potência Aeróbia',
    secondaryMuscles: ['Glúteos', 'Panturrilhas', 'Core'],
    videoUrl: 'https://www.youtube.com/watch?v=soccer_agility_power',
    instructions: [
      'Salto bipodal sobre 3 mini-barreiras de 30cm com amortecimento suave.',
      'Deslocamento lateral em estacas com recuperação rápida de postura.',
      'Sprint frontal de 7 metros recebendo bola quicando de frente para o gol.',
      'Chute forte de média distância com foco na precisão.'
    ],
    tips: 'Aterrissar sempre na ponta dos pés flexionando levemente os joelhos.'
  }
];

export const EXERCISE_CATALOG: ExerciseCatalogItem[] = [
  ...CORE_SIGNATURE_EXERCISES,
  ...FUTEBOL_EXERCISES,
  ...FULL_EXERCISE_CATALOG
];

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'tpl-abc-classico',
    title: 'Hipertrofia Clássica ABC (Push / Pull / Legs)',
    category: 'Hipertrofia',
    level: 'Intermediário',
    objective: 'Ganho de massa muscular com alta frequência semanal (3x a 6x)',
    description: 'Divisão equilibrada biomecanicamente: Treino A (Peito, Ombros e Tríceps), Treino B (Costas, Bíceps e Trapézio), Treino C (Membros Inferiores Completos e Abdômen).',
    splits: [
      {
        name: 'Treino A - Peito, Deltoides e Tríceps (Push)',
        exercises: [
          { id: 't1', name: 'Supino Reto com Barra Olímpica', muscleGroup: 'Peito', sets: 4, reps: '8-10', weightKg: 70, restSec: 90, equipment: 'Barra', method: 'Tradicional', notes: 'Aquecimento piramidal na 1ª série' },
          { id: 't2', name: 'Supino Inclinado com Halteres', muscleGroup: 'Peito', sets: 4, reps: '10-12', weightKg: 24, restSec: 60, equipment: 'Halteres', method: 'Tradicional', notes: 'Banco a 30 graus' },
          { id: 't3', name: 'Crucifixo / Crossover na Polia Média', muscleGroup: 'Peito', sets: 3, reps: '12-15', weightKg: 20, restSec: 45, equipment: 'Cabos/Polia', method: 'Drop-set', notes: 'Drop na última série' },
          { id: 't4', name: 'Desenvolvimento com Halteres Sentado', muscleGroup: 'Ombros', sets: 4, reps: '10-12', weightKg: 18, restSec: 60, equipment: 'Halteres', method: 'Tradicional' },
          { id: 't5', name: 'Elevação Lateral com Halteres', muscleGroup: 'Ombros', sets: 4, reps: '12-15', weightKg: 10, restSec: 45, equipment: 'Halteres', method: 'Rest-pause' },
          { id: 't6', name: 'Tríceps Pulley com Corda', muscleGroup: 'Braços', sets: 4, reps: '12-15', weightKg: 35, restSec: 45, equipment: 'Cabos/Polia', method: 'Tradicional' },
          { id: 't7', name: 'Tríceps Testa com Barra W', muscleGroup: 'Braços', sets: 3, reps: '10-12', weightKg: 26, restSec: 60, equipment: 'Barra', method: 'Tradicional' }
        ]
      },
      {
        name: 'Treino B - Dorsais, Deltoide Posterior e Bíceps (Pull)',
        exercises: [
          { id: 't8', name: 'Puxada Frontal Aberta no Pulley', muscleGroup: 'Costas', sets: 4, reps: '10-12', weightKg: 65, restSec: 60, equipment: 'Cabos/Polia', method: 'Tradicional' },
          { id: 't9', name: 'Remada Curvada com Barra (Pronada)', muscleGroup: 'Costas', sets: 4, reps: '8-10', weightKg: 60, restSec: 75, equipment: 'Barra', method: 'Pirâmide Crescente' },
          { id: 't10', name: 'Remada Baixa no Triângulo (Polia Sentada)', muscleGroup: 'Costas', sets: 3, reps: '12', weightKg: 55, restSec: 45, equipment: 'Cabos/Polia', method: 'Tradicional' },
          { id: 't11', name: 'Crucifixo Inverso no Cabo ou Halteres', muscleGroup: 'Ombros', sets: 4, reps: '15', weightKg: 8, restSec: 45, equipment: 'Halteres', method: 'Tradicional' },
          { id: 't12', name: 'Rosca Direta com Barra W', muscleGroup: 'Braços', sets: 4, reps: '10-12', weightKg: 24, restSec: 60, equipment: 'Barra', method: 'Tradicional' },
          { id: 't13', name: 'Rosca Martelo Alternada com Halteres', muscleGroup: 'Braços', sets: 3, reps: '12', weightKg: 14, restSec: 45, equipment: 'Halteres', method: 'Tradicional' }
        ]
      },
      {
        name: 'Treino C - Membros Inferiores e Abdômen (Legs & Core)',
        exercises: [
          { id: 't14', name: 'Agachamento Livre com Barra Olímpica', muscleGroup: 'Pernas', sets: 4, reps: '8-10', weightKg: 80, restSec: 90, equipment: 'Barra', method: 'Tradicional' },
          { id: 't15', name: 'Leg Press 45° Articulado', muscleGroup: 'Pernas', sets: 4, reps: '10-12', weightKg: 200, restSec: 75, equipment: 'Máquina', method: 'Tradicional' },
          { id: 't16', name: 'Cadeira Extensora', muscleGroup: 'Pernas', sets: 3, reps: '12-15', weightKg: 50, restSec: 45, equipment: 'Máquina', method: 'Drop-set' },
          { id: 't17', name: 'Mesa Flexora (Deitado)', muscleGroup: 'Pernas', sets: 4, reps: '10-12', weightKg: 40, restSec: 60, equipment: 'Máquina', method: 'Tradicional' },
          { id: 't18', name: 'Gêmeos Sentado na Máquina (Panturrilha)', muscleGroup: 'Pernas', sets: 4, reps: '15-20', weightKg: 35, restSec: 45, equipment: 'Máquina', method: 'Isometria' },
          { id: 't19', name: 'Abdominal Supra na Prancha Inclinada', muscleGroup: 'Abdômen', sets: 3, reps: '20', restSec: 30, equipment: 'Peso Corporal', method: 'Tradicional' },
          { id: 't20', name: 'Prancha Frontal Isométrica', muscleGroup: 'Abdômen', sets: 3, reps: '45s', restSec: 30, equipment: 'Peso Corporal', method: 'Isometria' }
        ]
      }
    ]
  },
  {
    id: 'tpl-feminino-gluteos',
    title: 'Treino Feminino - Foco em Glúteos, Coxas & Tonificação',
    category: 'Feminino',
    level: 'Intermediário',
    objective: 'Hipertrofia de glúteos, densidade de posteriores e queima calórica',
    description: 'Periodização com ênfase biomecânica no glúteo máximo e médio, além de superiores funcionais para postura elegante.',
    splits: [
      {
        name: 'Treino A - Foco em Glúteo & Isquiotibiais',
        exercises: [
          { id: 'tf1', name: 'Elevação Pélvica com Barra / Hip Thrust', muscleGroup: 'Pernas', sets: 4, reps: '10-12', weightKg: 65, restSec: 60, equipment: 'Barra', method: 'Ponto Zero', notes: 'Pausa de 2s no topo' },
          { id: 'tf2', name: 'Stiff com Barra ou Halteres', muscleGroup: 'Pernas', sets: 4, reps: '12', weightKg: 20, restSec: 60, equipment: 'Halteres', method: 'Tradicional' },
          { id: 'tf3', name: 'Mesa Flexora (Deitado)', muscleGroup: 'Pernas', sets: 3, reps: '12-15', weightKg: 30, restSec: 45, equipment: 'Máquina', method: 'Tradicional' },
          { id: 'tf4', name: 'Cadeira Abdutora', muscleGroup: 'Pernas', sets: 4, reps: '15-20', weightKg: 45, restSec: 45, equipment: 'Máquina', method: 'Drop-set', notes: 'Tronco inclinado à frente' }
        ]
      },
      {
        name: 'Treino B - Superiores & Abdômen',
        exercises: [
          { id: 'tf5', name: 'Puxada Frontal Aberta no Pulley', muscleGroup: 'Costas', sets: 3, reps: '12', weightKg: 35, restSec: 45, equipment: 'Cabos/Polia', method: 'Tradicional' },
          { id: 'tf6', name: 'Desenvolvimento com Halteres Sentado', muscleGroup: 'Ombros', sets: 3, reps: '12', weightKg: 8, restSec: 45, equipment: 'Halteres', method: 'Tradicional' },
          { id: 'tf7', name: 'Elevação Lateral com Halteres', muscleGroup: 'Ombros', sets: 3, reps: '15', weightKg: 5, restSec: 45, equipment: 'Halteres', method: 'Tradicional' },
          { id: 'tf8', name: 'Tríceps Pulley com Corda', muscleGroup: 'Braços', sets: 3, reps: '12-15', weightKg: 20, restSec: 45, equipment: 'Cabos/Polia', method: 'Tradicional' },
          { id: 'tf9', name: 'Prancha Frontal Isométrica', muscleGroup: 'Abdômen', sets: 4, reps: '40s', restSec: 30, equipment: 'Peso Corporal', method: 'Isometria' }
        ]
      },
      {
        name: 'Treino C - Quadríceps & Panturrilhas',
        exercises: [
          { id: 'tf10', name: 'Leg Press 45° Articulado', muscleGroup: 'Pernas', sets: 4, reps: '12', weightKg: 140, restSec: 60, equipment: 'Máquina', method: 'Tradicional' },
          { id: 'tf11', name: 'Agachamento Livre com Barra Olímpica', muscleGroup: 'Pernas', sets: 3, reps: '10', weightKg: 45, restSec: 75, equipment: 'Barra', method: 'Tradicional' },
          { id: 'tf12', name: 'Cadeira Extensora', muscleGroup: 'Pernas', sets: 4, reps: '12-15', weightKg: 35, restSec: 45, equipment: 'Máquina', method: 'Drop-set' },
          { id: 'tf13', name: 'Gêmeos Sentado na Máquina (Panturrilha)', muscleGroup: 'Pernas', sets: 4, reps: '20', weightKg: 25, restSec: 45, equipment: 'Máquina', method: 'Tradicional' }
        ]
      }
    ]
  },
  {
    id: 'tpl-iniciante-fullbody',
    title: 'Adaptação Anatômica & Iniciantes (Full-Body)',
    category: 'Iniciante',
    level: 'Iniciante',
    objective: 'Adaptação neuromuscular, ganho de tônus e segurança articular',
    description: 'Treino de corpo inteiro em dias alternados (Segunda, Quarta e Sexta) ideal para novos alunos nas primeiras 4 a 6 semanas.',
    splits: [
      {
        name: 'Treino A (Segunda / Sexta)',
        exercises: [
          { id: 'ti1', name: 'Leg Press 45° Articulado', muscleGroup: 'Pernas', sets: 3, reps: '12-15', weightKg: 80, restSec: 60, equipment: 'Máquina', method: 'Tradicional' },
          { id: 'ti2', name: 'Voador / Pec Deck na Máquina', muscleGroup: 'Peito', sets: 3, reps: '12', weightKg: 25, restSec: 60, equipment: 'Máquina', method: 'Tradicional' },
          { id: 'ti3', name: 'Puxada Frontal Aberta no Pulley', muscleGroup: 'Costas', sets: 3, reps: '12', weightKg: 30, restSec: 60, equipment: 'Cabos/Polia', method: 'Tradicional' },
          { id: 'ti4', name: 'Elevação Lateral com Halteres', muscleGroup: 'Ombros', sets: 3, reps: '12', weightKg: 4, restSec: 45, equipment: 'Halteres', method: 'Tradicional' },
          { id: 'ti5', name: 'Abdominal Supra na Prancha Inclinada', muscleGroup: 'Abdômen', sets: 3, reps: '15', restSec: 45, equipment: 'Peso Corporal', method: 'Tradicional' },
          { id: 'ti6', name: 'Esteira Ergométrica (Corrida / Caminhada Inclinada)', muscleGroup: 'Cardio', sets: 1, reps: '20 min', restSec: 0, equipment: 'Aparelho Cárdio', method: 'Tradicional', notes: 'Velocidade 5.5 a 6.5 km/h' }
        ]
      },
      {
        name: 'Treino B (Quarta-feira)',
        exercises: [
          { id: 'ti7', name: 'Cadeira Extensora', muscleGroup: 'Pernas', sets: 3, reps: '12', weightKg: 25, restSec: 60, equipment: 'Máquina', method: 'Tradicional' },
          { id: 'ti8', name: 'Mesa Flexora (Deitado)', muscleGroup: 'Pernas', sets: 3, reps: '12', weightKg: 20, restSec: 60, equipment: 'Máquina', method: 'Tradicional' },
          { id: 'ti9', name: 'Remada Baixa no Triângulo (Polia Sentada)', muscleGroup: 'Costas', sets: 3, reps: '12', weightKg: 25, restSec: 60, equipment: 'Cabos/Polia', method: 'Tradicional' },
          { id: 'ti10', name: 'Supino Inclinado com Halteres', muscleGroup: 'Peito', sets: 3, reps: '12', weightKg: 8, restSec: 60, equipment: 'Halteres', method: 'Tradicional' },
          { id: 'ti11', name: 'Prancha Frontal Isométrica', muscleGroup: 'Abdômen', sets: 3, reps: '30s', restSec: 30, equipment: 'Peso Corporal', method: 'Isometria' },
          { id: 'ti12', name: 'Bicicleta Ergométrica (Spinning / Air Bike)', muscleGroup: 'Cardio', sets: 1, reps: '20 min', restSec: 0, equipment: 'Aparelho Cárdio', method: 'Tradicional' }
        ]
      }
    ]
  },
  {
    id: 'tpl-hipertrofia-avancada',
    title: 'Hipertrofia Avançada ABCDE com FST-7',
    category: 'Hipertrofia',
    level: 'Avançado',
    objective: 'Volume máximo por grupamento muscular e quebra de platô',
    description: 'Divisão de 5 dias isolando cada grupo: A (Peito), B (Costas), C (Pernas Foco Quadríceps), D (Ombros & Trapézio), E (Braços & Isquiotibiais).',
    splits: [
      {
        name: 'Treino A - Peitoral & Abdômen',
        exercises: [
          { id: 'ta1', name: 'Supino Reto com Barra Olímpica', muscleGroup: 'Peito', sets: 4, reps: '6-8', weightKg: 95, restSec: 90, equipment: 'Barra', method: 'Pirâmide Crescente' },
          { id: 'ta2', name: 'Supino Inclinado com Halteres', muscleGroup: 'Peito', sets: 4, reps: '8-10', weightKg: 32, restSec: 75, equipment: 'Halteres', method: 'Tradicional' },
          { id: 'ta3', name: 'Supino Declinado com Barra', muscleGroup: 'Peito', sets: 3, reps: '10-12', weightKg: 75, restSec: 60, equipment: 'Barra', method: 'Tradicional' },
          { id: 'ta4', name: 'Crucifixo / Crossover na Polia Média', muscleGroup: 'Peito', sets: 7, reps: '12', weightKg: 20, restSec: 30, equipment: 'Cabos/Polia', method: 'FST-7', notes: 'Fascia Stretch Training: 7 séries com 30s de descanso e alongamento intra-série' }
        ]
      },
      {
        name: 'Treino B - Dorsais & Lombar',
        exercises: [
          { id: 'tb1', name: 'Levantamento Terra Clássico (Deadlift)', muscleGroup: 'Costas', sets: 4, reps: '6', weightKg: 130, restSec: 120, equipment: 'Barra', method: 'Tradicional' },
          { id: 'tb2', name: 'Barra Fixa Pronada (Pull-up)', muscleGroup: 'Costas', sets: 4, reps: 'Falha', restSec: 90, equipment: 'Peso Corporal', method: 'Tradicional' },
          { id: 'tb3', name: 'Remada Curvada com Barra (Pronada)', muscleGroup: 'Costas', sets: 4, reps: '8-10', weightKg: 80, restSec: 75, equipment: 'Barra', method: 'Tradicional' },
          { id: 'tb4', name: 'Puxada Frontal Aberta no Pulley', muscleGroup: 'Costas', sets: 7, reps: '12', weightKg: 55, restSec: 30, equipment: 'Cabos/Polia', method: 'FST-7' }
        ]
      }
    ]
  },
  {
    id: 'tpl-masculino-upper-lower',
    title: 'Treino Masculino - Força & Hipertrofia (Upper / Lower 4x)',
    category: 'Masculino',
    level: 'Intermediário',
    objective: 'Desenvolvimento de força, largura de ombros, dorsal em V e densidade de pernas',
    description: 'Protocolo de 4 dias por semana com distribuição Upper (Superiores foco Peito/Costas/Ombros) e Lower (Inferiores pesados com Agachamento e Leg Press).',
    splits: [
      {
        name: 'Treino A - Superiores (Upper Heavy)',
        exercises: [
          { id: 'tm1', name: 'Supino Reto com Barra Olímpica', muscleGroup: 'Peito', sets: 4, reps: '6-8', weightKg: 80, restSec: 90, equipment: 'Barra', method: 'Tradicional' },
          { id: 'tm2', name: 'Remada Curvada com Barra (Pronada)', muscleGroup: 'Costas', sets: 4, reps: '8', weightKg: 70, restSec: 90, equipment: 'Barra', method: 'Tradicional' },
          { id: 'tm3', name: 'Desenvolvimento Militar com Halteres Sentado', muscleGroup: 'Ombros', sets: 3, reps: '10', weightKg: 22, restSec: 60, equipment: 'Halteres', method: 'Tradicional' },
          { id: 'tm4', name: 'Puxada Frontal Aberta no Pulley', muscleGroup: 'Costas', sets: 3, reps: '10-12', weightKg: 60, restSec: 60, equipment: 'Cabos/Polia', method: 'Tradicional' },
          { id: 'tm5', name: 'Supino Inclinado com Halteres', muscleGroup: 'Peito', sets: 3, reps: '10-12', weightKg: 26, restSec: 60, equipment: 'Halteres', method: 'Tradicional' },
          { id: 'tm6', name: 'Tríceps Pulley com Corda', muscleGroup: 'Braços', sets: 3, reps: '12', weightKg: 35, restSec: 45, equipment: 'Cabos/Polia', method: 'Tradicional' },
          { id: 'tm7', name: 'Rosca Direta com Barra W', muscleGroup: 'Braços', sets: 3, reps: '10-12', weightKg: 26, restSec: 45, equipment: 'Barra', method: 'Tradicional' }
        ]
      },
      {
        name: 'Treino B - Inferiores (Lower Heavy)',
        exercises: [
          { id: 'tm8', name: 'Agachamento Livre com Barra Olímpica', muscleGroup: 'Pernas', sets: 4, reps: '6-8', weightKg: 90, restSec: 120, equipment: 'Barra', method: 'Tradicional' },
          { id: 'tm9', name: 'Leg Press 45° Articulado', muscleGroup: 'Pernas', sets: 4, reps: '10-12', weightKg: 220, restSec: 90, equipment: 'Máquina', method: 'Tradicional' },
          { id: 'tm10', name: 'Stiff com Barra Olímpica', muscleGroup: 'Pernas', sets: 3, reps: '10', weightKg: 55, restSec: 75, equipment: 'Barra', method: 'Tradicional' },
          { id: 'tm11', name: 'Mesa Flexora (Deitado)', muscleGroup: 'Pernas', sets: 3, reps: '12', weightKg: 35, restSec: 60, equipment: 'Máquina', method: 'Drop-set' },
          { id: 'tm12', name: 'Gêmeos Sentado na Máquina (Panturrilha)', muscleGroup: 'Pernas', sets: 4, reps: '15-20', weightKg: 40, restSec: 45, equipment: 'Máquina', method: 'Isometria' },
          { id: 'tm13', name: 'Abdominal Supra na Prancha Inclinada', muscleGroup: 'Abdômen', sets: 3, reps: '20', restSec: 30, equipment: 'Peso Corporal', method: 'Tradicional' }
        ]
      }
    ]
  },
  {
    id: 'tpl-reabilitacao-articular',
    title: 'Reabilitação & Estabilidade Funcional (Ombro, Coluna & Joelho)',
    category: 'Reabilitação',
    level: 'Iniciante',
    objective: 'Fortalecimento de manguito rotador, alívio de lombalgia e estabilização de joelhos',
    description: 'Protocolo preventivo e reabilitativo desenvolvido para alunos com queixas posturais, condromalácia patelar, impacto no ombro ou retorno pós-lesão.',
    splits: [
      {
        name: 'Treino A - Estabilidade Escapular, Manguito & Core',
        exercises: [
          { id: 'tr1', name: 'Prancha Frontal Isométrica', muscleGroup: 'Abdômen', sets: 3, reps: '30s', restSec: 45, equipment: 'Peso Corporal', method: 'Isometria', notes: 'Manter coluna neutra e glúteos contraídos' },
          { id: 'tr2', name: 'Crucifixo Inverso no Cabo ou Halteres', muscleGroup: 'Ombros', sets: 3, reps: '15', weightKg: 5, restSec: 45, equipment: 'Cabos/Polia', method: 'Tradicional', notes: 'Ativação consciente de romboides e trapézio médio' },
          { id: 'tr3', name: 'Puxada Frontal Aberta no Pulley', muscleGroup: 'Costas', sets: 3, reps: '12-15', weightKg: 25, restSec: 60, equipment: 'Cabos/Polia', method: 'Tradicional', notes: 'Cadência 3020 com foco em retração escapular' },
          { id: 'tr4', name: 'Elevação Lateral com Halteres', muscleGroup: 'Ombros', sets: 3, reps: '12', weightKg: 3, restSec: 45, equipment: 'Halteres', method: 'Tradicional', notes: 'Não ultrapassar a linha dos ombros (plano escapular)' }
        ]
      },
      {
        name: 'Treino B - Estabilização de Joelho, Quadril & Cadeia Posterior',
        exercises: [
          { id: 'tr5', name: 'Elevação Pélvica com Barra / Hip Thrust', muscleGroup: 'Pernas', sets: 3, reps: '15', weightKg: 20, restSec: 60, equipment: 'Peso Corporal', method: 'Isometria', notes: 'Segurar 2s no ponto mais alto' },
          { id: 'tr6', name: 'Leg Press 45° Articulado', muscleGroup: 'Pernas', sets: 3, reps: '12-15', weightKg: 60, restSec: 60, equipment: 'Máquina', method: 'Tradicional', notes: 'Amplitude segura sem retroversão da pelve' },
          { id: 'tr7', name: 'Mesa Flexora (Deitado)', muscleGroup: 'Pernas', sets: 3, reps: '12-15', weightKg: 20, restSec: 45, equipment: 'Máquina', method: 'Tradicional' },
          { id: 'tr8', name: 'Bicicleta Ergométrica (Spinning / Air Bike)', muscleGroup: 'Cardio', sets: 1, reps: '15 min', restSec: 0, equipment: 'Aparelho Cárdio', method: 'Tradicional', notes: 'Cadência leve e sem sobrecarga excessiva' }
        ]
      }
    ]
  }
];

export const INITIAL_LOAD_LOGS: { [studentId: string]: any[] } = {};

export const INITIAL_PHYSICAL_TESTS: any[] = [];
