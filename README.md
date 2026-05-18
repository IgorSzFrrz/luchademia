# Luchademia

> Bata sua frequencia. Derrote os outros.

Jogo mobile de frequencia na academia em formato PvP. Conceito completo em
[`luchademia_conceito.md`](luchademia_conceito.md).

## Estrutura

```text
luchademia/
|-- app/                    Aplicativo React Native (Expo SDK 54)
|   |-- App.tsx             Entry point
|   |-- src/
|   |   |-- components/     Componentes compartilhados
|   |   |-- lib/            Clientes (Supabase, etc)
|   |   |-- navigation/     Stack raiz + tabs + onboarding
|   |   |-- screens/        Telas do app
|   |   |-- store/          Zustand stores
|   |   |-- theme/          Cores, fontes e spacing
|   |   `-- types/          Tipos de dominio
|   |-- app.json            Config Expo
|   `-- .env.example        Variaveis publicas (Supabase, Google Maps)
`-- supabase/
    |-- functions/
    |   `-- search-gyms-nearby/
    `-- migrations/
        |-- 0001_init.sql   Schema do MVP
        |-- 0002_battle_mvp_rpcs.sql
        |-- 0003_checkin_mvp.sql
        |-- 0004_damage_and_rankings.sql
        |-- 0005_home_mvp.sql
        |-- 0006_battle_detail_mvp.sql
        `-- 0007_profile_dashboard_mvp.sql
```

## Stack atual

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript strict
- React Navigation 7
- Zustand
- Supabase JS v2
- PostgreSQL + PostGIS via Supabase
- `expo-location` para o check-in do MVP
- `expo-notifications` para push notifications futuras
- `react-native-maps` para mapas

## Setup

### 1. App mobile

```powershell
cd app
copy .env.example .env       # preencha URL/keys
npm install
npm run start
```

Scripts uteis:

```powershell
npm run typecheck
npm run check:deps
npm run start:dev-client
```

Para o MVP, a estrategia de localizacao e `expo-location` com validacao
server-side no Supabase. O app nao depende de `react-native-background-geolocation`
nesta fase. Se a V1 exigir monitoramento robusto em background, ai vale introduzir
dev client/EAS e uma biblioteca nativa dedicada.

### 2. Backend (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, rode o conteudo de `supabase/migrations/0001_init.sql`.
3. Rode tambem `supabase/migrations/0002_battle_mvp_rpcs.sql`.
4. Rode tambem `supabase/migrations/0003_checkin_mvp.sql`.
5. Rode tambem `supabase/migrations/0004_damage_and_rankings.sql`.
6. Rode tambem `supabase/migrations/0005_home_mvp.sql`.
7. Rode tambem `supabase/migrations/0006_battle_detail_mvp.sql`.
8. Rode tambem `supabase/migrations/0007_profile_dashboard_mvp.sql`.
9. Para teste local/MVP sem Google Places, rode `supabase/seed.sql`.
10. Em **Authentication -> Providers**, habilite **Google**.
11. Em **Authentication -> URL Configuration**, adicione `luchademia://auth/callback` em Redirect URLs.
12. Copie `URL` e `anon key` para `app/.env`.

Para busca real de academias proximas, configure tambem a secret da Edge Function:

```powershell
supabase secrets set GOOGLE_PLACES_API_KEY=... --project-ref <project-ref>
supabase functions deploy search-gyms-nearby --project-ref <project-ref>
```

## Estado atual

- [x] Scaffold Expo TS com tema customizado
- [x] Navegacao: onboarding + tabs + fluxos auxiliares
- [x] Cliente Supabase + auth store (Zustand)
- [x] Schema SQL inicial com RLS
- [x] `app.json` alinhado a localizacao foreground para o MVP
- [x] Scripts basicos de validacao
- [x] Google OAuth real
- [x] Selecao real de academia
- [x] Check-in real com GPS foreground + timer de 15 min + validacao server-side
- [x] Criar/listar/aceitar batalha 1v1 aberta via RPC
- [x] Job idempotente de dano/no-show
- [x] Ranking individual basico via RPC
- [x] Home conectada a profile, check-in do dia e batalhas 1v1 reais
- [x] Detalhe da batalha 1v1 conectado a dados reais
- [x] Perfil conectado a estatisticas, check-ins, streak e historico reais
- [x] Busca de academias por localizacao via Edge Function, com fallback para seed
- [x] Convite 1v1 por codigo/link e aceite manual

Roadmap completo na secao 10 do conceito.
