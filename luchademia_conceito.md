# LUCHADEMIA

> Nota de Fase 0 (maio/2026): a stack efetiva do app esta em Expo SDK 54,
> React Native 0.81, React 19 e TypeScript strict. Para o MVP, a estrategia
> recomendada de check-in e `expo-location` com validacao server-side no
> Supabase, sem `react-native-background-geolocation`. Trechos abaixo que citam
> Expo SDK 52, dev client obrigatorio ou background geolocation nativo devem ser
> tratados como historico ate a revisao completa deste documento.

**Documento de Conceito do Produto — v1.0 | Maio 2026**

Um jogo de frequência na academia onde batalhas PvP transformam o compromisso com o treino em competição direta. Lucha + Academia = Luchademia.

---

## 1. Visão Geral

### 1.1 Conceito

Luchademia é um aplicativo móvel que transforma a rotina de academia em um jogo competitivo PvP (jogador contra jogador). Ao invés de acumular pontos ou streaks tradicionais, os usuários se desafiam mutuamente em batalhas onde a ausência vira dano direto na barra de vida do adversário.

### 1.2 Elevator Pitch

> Um jogo de frequência na academia. Você vincula sua academia, desafia alguém para uma batalha, e cada dia que você não dá check-in, você perde vida. Quem zerar primeiro, perde. Simples, brutal, viciante.

### 1.3 Diferenciais

- **Pressão social invertida:** o objetivo não é "ganhar pontos por ir", é "fazer o outro perder vida por não ir".
- **Competição direta:** batalhas 1v1 e Battle Royale contra pessoas reais, não leaderboards abstratos.
- **Crescimento orgânico:** cada batalha criada é um convite para um novo usuário. O loop viral é o próprio produto.
- **Engajamento local:** rankings por academia criam comunidade e rivalidade no próprio vestiário.

---

## 2. Mecânica Central

### 2.1 Sistema de Dano

O sistema opera em três camadas simultâneas ao longo do dia:

**Dano do Dia (Passivo):** a partir do início da janela diária (padrão: 5h), cada jogador perde 1 HP por hora aberta até dar check-in. O relógio é individual — cada pessoa gerencia o próprio dano.

**Dano PvP (Ataque):** quando um jogador dá check-in, um período de graça de 4 horas se inicia para os adversários. Após esse período, cada adversário que ainda não deu check-in passa a receber 2 HP/h de dano PvP do atacante, além do dano do dia. Múltiplos atacantes acumulam dano em paralelo.

**Penalidade de No-show:** se um jogador não der check-in durante todo o dia, recebe −20 HP adicionais à meia-noite. Diferencia "chegar muito tarde" de "não ir de jeito nenhum".

### 2.2 Parâmetros Padrão

| Parâmetro | Valor Padrão |
|---|---|
| Janela do dia | 5h – 23h (18 horas) |
| Dano do dia | 1 HP por hora aberta |
| Graça PvP | 4 horas após check-in do adversário |
| Dano PvP | 2 HP por hora após graça |
| Penalidade no-show | −20 HP à meia-noite |
| HP base | 40 HP × dias da batalha |

### 2.3 Exemplo Prático

> **Cenário: Bruno vs Artur — Dia típico**
>
> Janela: 5h–23h. Artur dá check-in às 10h15. Bruno dá check-in às 16h40.
>
> - Artur: Dano do dia de 5h a 10h15 = 5 HP. **Total: −5 HP.**
> - Bruno: Dano do dia de 5h a 16h40 = 11 HP. PvP de Artur após graça (14h15–16h40 ≈ 2,5h × 2) = 5 HP. **Total: −16 HP.**
>
> Resultado: Artur saiu melhor por ter ido cedo. Bruno sobreviveu mas perdeu terreno.

### 2.4 Cenários de Dano Diário

| Cenário | Dano Estimado | Avaliação |
|---|---|---|
| Ambos cedo (dentro da graça) | 3–4 HP cada | Empate saudável |
| Atrasado razoável (16h, oponente 8h) | ~19 HP | Sustentável |
| Muito atrasado (22h, oponente 6h) | ~41 HP | Doloroso |
| No-show total (oponente 5h) | ~66 HP | Devastador |

Com HP base de 40 por dia, uma batalha de 5 dias tem 200 HP. Três dias de no-show total (~198 HP) quase eliminam o jogador, permitindo derrotas precoces sem tornar batalhas injustas.

---

## 3. Tipos de Batalha

### 3.1 Batalha 1v1

Duelo direto entre dois jogadores. O sistema mais simples e a porta de entrada do produto. Durações disponíveis: 5, 10, 15 ou 30 dias. HP = 40 × dias. Quem zerar a vida primeiro perde; se ambos sobreviverem até o último dia, vence quem tiver mais HP.

### 3.2 Battle Royale (BR)

Todos contra todos em grupos de 3 a 10 jogadores. Cada jogador que dá check-in antes de você se torna um atacante ativo. O último a checar (ou a não checar) toma PvP de todos os anteriores simultaneamente.

**Escalonamento de HP em BR:** para compensar o acúmulo de dano PvP de múltiplos atacantes, o HP base é multiplicado pela raiz quadrada do número de participantes:

- BR de 4 pessoas: HP base × 2,0
- BR de 9 pessoas: HP base × 3,0
- BR de 10 pessoas: HP base × 3,16

**Eliminação:** quando um jogador zera a vida numa BR, é eliminado. Posição final = ordem inversa de eliminação (primeiro a morrer fica em último). Sobreviventes continuam até o fim da batalha ou até restar um.

**Pontuação de BR:** 1° lugar = N × 2 pontos (onde N = participantes), decrescendo 2 pontos por posição. Exemplo em BR de 5: 1° = 10 pts, 2° = 8, 3° = 6, 4° = 4, 5° = 2.

### 3.3 Limites de Batalhas Simultâneas

| Tipo | Limite |
|---|---|
| Batalhas 1v1 | 10 simultâneas |
| Battle Royales | 3–4 simultâneas |

Esses limites evitam que uma mesma pessoa domine o ranking por volume de batalhas e garantem que cada batalha receba atenção real do jogador.

---

## 4. Sistema de Check-in e Anti-Trapaça

### 4.1 Fluxo de Check-in

1. Usuário toca "Dar check-in" na Home.
2. App verifica GPS: está dentro do raio de 100m da academia vinculada?
3. Se sim, timer de 15 minutos de permanência inicia automaticamente.
4. App monitora posição em background durante os 15 min (usuário pode treinar normalmente).
5. Após 15 min dentro do raio, check-in é confirmado.
6. Tela de confirmação mostra impacto: quem você atacou, onde está seguro.

### 4.2 Edge Cases do Check-in

- **Fora da academia:** "Você está a X km de [academia]. Toque para abrir rotas."
- **Saída durante timer:** Notificação push imediata. Tolerância de 3 min fora do raio (bebedouro, banheiro). Após isso, check-in cancelado.
- **GPS desligado:** Modal explicativo com botão "Abrir Ajustes".
- **Já checou hoje:** Botão de check-in desaparece, substituído pelo sumário do dia.
- **Cancelamento mid-timer:** Modal de confirmação para evitar perda acidental de progresso.

### 4.3 Anti-Trapaça

**MVP (Lançamento):**
- GPS com raio de 100m da academia vinculada via Google Maps.
- Geofence com permanência mínima de 15 minutos. Filtra drive-by check-ins.

**V2 (Pós-validação):**
- Foto ao vivo no check-in: câmera do app (sem galeria). Selfie com equipamento da academia ao fundo prova identidade e localização.
- Wi-Fi/BLE fingerprint: coleta SSIDs visíveis no primeiro check-in legítimo, compara nas visitas seguintes. Mock GPS não forja vizinhança digital.

**V3+ (Escala):**
- QR code físico: adesivo na recepção da academia. Versão dinâmica (QR rotativo) para parcerias premium.
- Integração com catraca: API direta com redes como Smart Fit, Bio Ritmo. Verificação inquestionável.

> **Princípio de Design:** o objetivo não é ser à prova de bala — é ser mais chato trapacear do que ir treinar. Sistema otimista: aceita o check-in, marca suspeitos para revisão posterior. Falso positivo (bloquear usuário legítimo) é pior que falso negativo (deixar um trapaceiro passar).

**Crowdsourcing:** botão "Reportar check-in suspeito" no perfil do adversário. Três ou mais reportes no mesmo usuário encaminham para revisão manual.

---

## 5. Rankings

### 5.1 Ranking Individual (W/L)

Ordenado por taxa de vitória (win rate). Filtro obrigatório: mínimo de 10 batalhas concluídas para aparecer no ranking público. Exibe nome, academia, registro de vitórias/derrotas e percentual.

### 5.2 Ranking de Battle Royale (Pontos)

Ordenado por pontos acumulados em BRs. Pontuação proporcional ao tamanho do grupo: 1° lugar = N × 2 pontos, decrescendo 2 por posição. Normaliza BRs de diferentes tamanhos.

### 5.3 Ranking por Academia

Filtra o ranking para usuários da mesma academia. Cria identidade local e rivalidade no vestiário. Padrão: exibe a academia do usuário, com opção de explorar outras.

---

## 6. Conquistas

Sistema de achievements com três estados visuais: desbloqueado (completo), em progresso (barra parcial com contagem), e trancado (opaco, misterioso). Conquistas secretas ("???") adicionam camada de descoberta. Tela de desbloqueio com indicador de raridade e botão de compartilhamento como CTA principal.

### 6.1 Frequência

- **Sequência de 7 / 14 / 30 / 60 / 90 / 365 dias** de check-ins consecutivos.
- **Madrugador:** check-in antes das 7h por 5 dias.
- **Veterano:** 100 / 500 / 1000 check-ins totais.
- **Perfeito:** check-in todo dia de uma batalha inteira.

### 6.2 Batalhas

- **Primeira Sangue:** vença sua primeira batalha.
- **Imbatível:** 5 vitórias seguidas.
- **Gladiador:** vença 5 / 10 / 25 / 50 / 100 batalhas.
- **Maratonista:** vença uma batalha de 30 dias.
- **Por Um Fio:** vença com menos de 10 HP restante.

### 6.3 Battle Royale

- **Rei do Pedaço:** 1° lugar numa BR.
- **Pódio Garantido:** top 3 em 5 BRs.
- **Sobrevivente:** sobreviver uma BR de 10 pessoas.
- **Golpe Fatal:** ser o atacante que eliminou alguém.

### 6.4 Ranking

- **Top 10 / Top 3 / N°1** no ranking geral.
- **Trono Firme:** 7 dias consecutivos no top 3.
- **Rei da Academia:** N°1 no ranking da sua academia.

### 6.5 Conquistas Secretas

- **Primeiro Raio:** check-in exatamente às 5h00.
- **Sem Folga:** check-in no dia de Natal ou Ano Novo.
- **Semana de Fúria:** vencer 3 batalhas na mesma semana.
- **Exército de Um:** ter 10 batalhas simultâneas ativas.

---

## 7. Fluxo de Telas

### 7.1 Onboarding (3 telas)

1. **Boas-vindas:** logo Luchademia, tagline "Bata sua frequência. Derrote os outros.", botão "Continuar com Google". Login único via Gmail.
2. **Vincular academia:** mapa no topo + lista de academias próximas (Google Places). Seleção com borda azul + check.
3. **Pronto:** três caminhos — "Buscar batalhas" (CTA principal), "Criar nova batalha", e "Tenho um convite" (fallback).

### 7.2 Home

Tela principal diária. Bloco "Hoje" domina com CTA de check-in ou sumário do dia (se já checou). Timer com countdown até o fim da janela. Abaixo, lista de batalhas ativas com barras de HP (verde > 30%, vermelho abaixo). Cards de 1v1 mostram duas barras lado a lado; cards de BR mostram ranking numerado. Bottom nav: Home, Buscar, Criar, Ranking, Perfil.

### 7.3 Buscar Batalhas

Duas abas: "Minha academia" (padrão) e "Todas". Filtros por tipo: 1v1 (padrão), BR, Todos. Ícone de filtros avançados para duração específica. Toque no card abre detalhe com informações e botão "Aceitar desafio".

### 7.4 Criar Batalha

Formulário direto: tipo (1v1 ou BR), duração (5/10/15/30 dias como pills), adversário (busca ou link de convite). Seção "Avançado" colapsável com parâmetros de janela, dano e penalidades. Resumo fixo no rodapé atualiza em tempo real antes do commit.

### 7.5 Check-in (3 estados)

1. **Chegada:** confirmação de GPS + timer de 15 min inicia automaticamente. "Pode treinar tranquilo, avisamos quando confirmar."
2. **Permanência:** timer grande no centro, indicador "monitorando" com dot verde. Usuário pode fechar o app (background tracking).
3. **Confirmado:** checkmark de sucesso, sumário de impacto por batalha. Badges "SEGURO" (cinza) e "ATACANDO" (verde).

### 7.6 Detalhe da Batalha

Tela narrativa. Topo: avatares em formato "VS" com HP atual e barras. Gráfico sparkline de HP ao longo dos dias. Timeline dia a dia mostrando quem checou primeiro, horário, e dano resultante. Dia atual destacado em azul com dano em tempo real.

### 7.7 Ranking

Três abas: Individual (W/L), BR (pontos), Academia (local). Primeiro lugar com card destacado. Cada entrada mostra avatar, nome, academia, métrica principal. Individual exige mínimo de 10 batalhas.

### 7.8 Perfil

Dashboard pessoal: grid 2×2 com vitórias, derrotas, taxa e check-ins totais. Card de sequência (streak) com ícone de chama. Histórico de batalhas recentes com badges V/D. Botão "Trocar academia" no rodapé. Acesso às Conquistas a partir do card de streak.

### 7.9 Conquistas

Grid 2 colunas com cards de achievement. Barra de progresso geral no topo ("12/48"). Filtros por categoria (Todas, Frequência, Batalhas, BR, Ranking). Três estados visuais: desbloqueado, em progresso, trancado. Tela de celebração ao desbloquear com botão de compartilhamento.

---

## 8. Decisões de Design

### 8.1 Mecânica

- **Relógios independentes (Modelo B):** cada jogador gerencia o próprio relógio de dano. Mais simples de explicar, incentivo mais agressivo para ir cedo, permite que batalhas terminem antes do previsto.
- **HP proporcional à duração:** 40 HP/dia normaliza a experiência entre batalhas curtas e longas. Eliminação precoce é possível e desejada.
- **Janela fixa 5h–23h:** padrão universal que cobre a maioria dos horários de treino. Customizável pelo criador da batalha para usuários avançados.

### 8.2 Produto

- **Login único via Google:** reduz onboarding a dois cliques. Nenhuma outra opção de login no MVP.
- **Anti-trapaça minimal no MVP:** apenas GPS + geofence. Câmera e Wi-Fi fingerprint entram na V2 quando a confiança do usuário no app já estiver estabelecida.
- **Buscar batalhas como CTA principal do onboarding:** usuário novo não conhece ninguém. "Buscar" faz o app parecer vivo imediatamente.
- **Link de convite no mesmo nível de "Buscar usuário":** cada batalha criada é oportunidade de tráfego orgânico.

### 8.3 UX

- **Bloco "Hoje" domina a Home:** única coisa que muda diariamente. Após check-in, transforma de CTA em sumário de recompensa.
- **Timer de check-in inicia automaticamente:** sem botão extra. Menos atrito = menos chance de esquecer de finalizar.
- **Tela de confirmação como dopamine hit:** badge "ATACANDO" em verde e "SEGURO" em cinza comunicam impacto em 0,2s.
- **Parâmetros avançados ocultos:** 95% dos usuários não mexem. Padrões sensíveis, complexidade opcional.

---

## 9. Stack Técnica

### 9.1 Visão Geral

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Mobile | React Native + Expo (dev client) | Codebase única iOS/Android. Expo dev client permite módulos nativos (background location). |
| Backend / BaaS | Supabase | Auth (Google OAuth), banco, realtime via websockets, Edge Functions, Row Level Security. |
| Banco de dados | PostgreSQL + PostGIS | Queries geoespaciais nativas (academias por raio). pg_cron para jobs de meia-noite (no-show, fechamento do dia). |
| Notificações push | Expo Notifications | Integrado ao ecossistema Expo. Push tokens gerenciados pelo Expo, delivery via APNs/FCM. |
| Mapas / Geolocalização | Google Maps + Google Places API | Busca de academias, vinculação via Places, exibição de mapa no onboarding e busca. |
| Geofencing / Background Location | react-native-background-geolocation | Monitoramento de permanência (15 min), detecção de entrada/saída do raio. |
| Cache | Upstash Redis (serverless) | Cache de rankings, dados frequentemente acessados. Tier gratuito generoso. |

### 9.2 Arquitetura Simplificada

```
┌─────────────────────────────────┐
│         React Native App        │
│     (Expo dev client build)     │
├─────────────────────────────────┤
│  Expo Notifications  │  Google  │
│  (push tokens/APNs/  │  Maps &  │
│   FCM delivery)      │  Places  │
└──────────┬──────────┬───────────┘
           │          │
           ▼          ▼
┌─────────────────────────────────┐
│           Supabase              │
├──────┬──────┬──────┬────────────┤
│ Auth │  DB  │ Real │   Edge     │
│Google│ Post │ time │ Functions  │
│OAuth │ GIS  │  WS  │  (lógica)  │
└──────┴──┬───┴──────┴────────────┘
          │
          ▼
┌─────────────────────────────────┐
│     PostgreSQL + PostGIS        │
│  pg_cron (jobs de meia-noite)   │
└─────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│      Upstash Redis              │
│  (cache rankings/sessões)       │
└─────────────────────────────────┘
```

### 9.3 Fluxos Técnicos Críticos

**Check-in:**
1. App detecta entrada no geofence (react-native-background-geolocation).
2. Inicia timer local de 15 min com verificação periódica de GPS.
3. Após 15 min, envia request para Supabase Edge Function com coordenadas + timestamp.
4. Edge Function valida: coordenadas dentro do raio? Timestamp coerente? Já checou hoje?
5. Se válido, insere check-in no banco. Supabase Realtime notifica adversários. Edge Function dispara push via Expo Notifications para adversários ("Fulano deu check-in!").

**Cálculo de dano (meia-noite):**
1. pg_cron trigger às 00:00 UTC-3.
2. Para cada batalha ativa: consulta check-ins do dia, calcula dano do dia + PvP + penalidade no-show.
3. Atualiza HP de cada jogador.
4. Se HP ≤ 0: marca jogador como eliminado, atualiza posição, dispara push de eliminação.
5. Se batalha encerrada (todos eliminados ou último dia): calcula resultado final, atualiza rankings, verifica conquistas desbloqueadas.

**Ranking:**
1. Atualizado via trigger no banco após cada batalha encerrada.
2. Resultado cacheado no Redis (TTL 5 min) para leitura rápida na tela de Ranking.
3. Ranking por academia usa PostGIS para filtrar por local.

### 9.4 Dependências Principais (package.json)

```json
{
  "dependencies": {
    "expo": "~52.x",
    "expo-location": "~17.x",
    "expo-notifications": "~0.28.x",
    "react-native-background-geolocation": "^4.x",
    "react-native-maps": "^1.x",
    "@supabase/supabase-js": "^2.x",
    "@react-navigation/native": "^7.x",
    "react-native-reanimated": "~3.x",
    "zustand": "^5.x"
  }
}
```

### 9.5 Custo Estimado (MVP)

| Serviço | Tier | Custo |
|---|---|---|
| Supabase | Free (500MB, 50k MAU) | $0 |
| Upstash Redis | Free (10k req/dia) | $0 |
| Google Maps/Places | $200 crédito mensal gratuito | $0 |
| Expo Notifications | Gratuito | $0 |
| Apple Developer Account | Anual | $99/ano |
| Google Play Developer | Única | $25 |
| **Total MVP** | | **~$124 no primeiro ano** |

---

## 10. Roadmap

| Fase | Escopo |
|---|---|
| **MVP** | 1v1 apenas. GPS + geofence. Google login. Buscar/criar batalha. Check-in flow. Ranking individual básico. |
| **V1** | Battle Royale. Conquistas. Ranking por academia. Notificações push. Compartilhamento social. |
| **V2** | Foto no check-in. Wi-Fi/BLE fingerprint. Chat na batalha. Dias de descanso. Cosméticos. |
| **V3+** | QR code físico. Integração com catracas. Parcerias com academias. Monetização. |

---

## 11. A Definir

- **Monetização:** premium com batalhas ilimitadas? Cosméticos (avatares, temas de HP bar)? Parcerias com academias?
- **Notificações push:** estratégia de timing — quando avisar que o adversário checou, quando alertar que a graça está acabando, quando é demais.
- **Chat ou interação social:** mensagens dentro da batalha? Reações ao check-in do adversário?
- **Dias de descanso:** treinar todo santo dia é insustentável do ponto de vista esportivo. Considerar "passes" de descanso por batalha ou domingos neutros.
- **Validação numérica via playtest:** todos os valores de dano, HP e graça são estimativas iniciais. Precisam de testes com usuários reais para calibrar.

---

*Luchademia — Bata sua frequência. Derrote os outros.*
