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
    `-- migrations/
        `-- 0001_init.sql   Schema do MVP
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
3. Em **Authentication -> Providers**, habilite **Google**.
4. Copie `URL` e `anon key` para `app/.env`.

## Estado atual

- [x] Scaffold Expo TS com tema customizado
- [x] Navegacao: onboarding + tabs + fluxos auxiliares
- [x] Cliente Supabase + auth store (Zustand)
- [x] Schema SQL inicial com RLS
- [x] `app.json` alinhado a localizacao foreground para o MVP
- [x] Scripts basicos de validacao
- [ ] Google OAuth real
- [ ] Selecao real de academia
- [ ] Check-in real com GPS + timer de 15 min
- [ ] Listagem real de batalhas
- [ ] Edge Functions: validacao de check-in e job de dano/no-show

Roadmap completo na secao 10 do conceito.
