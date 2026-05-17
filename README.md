# Luchademia

> Bata sua frequência. Derrote os outros.

Jogo de frequência na academia em formato PvP. Conceito completo em [`luchademia_conceito.md`](luchademia_conceito.md).

## Estrutura

```
luchademia/
├── app/                    Aplicativo React Native (Expo SDK 54)
│   ├── App.tsx             Entry point
│   ├── src/
│   │   ├── components/     Componentes compartilhados
│   │   ├── lib/            Clientes (Supabase, etc)
│   │   ├── navigation/     Stack raiz + tabs + onboarding
│   │   ├── screens/        Telas (Home, Search, Create, Ranking, Profile, Onboarding)
│   │   ├── store/          Zustand stores (auth, …)
│   │   ├── theme/          Cores e spacing
│   │   └── types/          Tipos de domínio
│   ├── app.json            Config Expo (permissões, plugins, scheme)
│   └── .env.example        Variáveis públicas (Supabase, Google Maps)
└── supabase/
    └── migrations/
        └── 0001_init.sql   Schema do MVP (profiles, gyms, battles, checkins, damage)
```

## Setup

### 1. App mobile

```powershell
cd app
copy .env.example .env       # preencha URL/keys
npm install
npx expo start --dev-client
```

> O MVP usa `react-native-background-geolocation` (módulo nativo), portanto requer
> **Expo dev client** — Expo Go não basta. Gere o dev client com EAS:
>
> ```powershell
> npx eas build --profile development --platform ios
> npx eas build --profile development --platform android
> ```

### 2. Backend (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, rode o conteúdo de `supabase/migrations/0001_init.sql`.
3. Em **Authentication → Providers**, habilite **Google**.
4. Copie `URL` e `anon key` para `app/.env`.

## Estado atual (fundação)

- [x] Scaffold Expo TS com dark theme
- [x] Navegação: Onboarding (Welcome → LinkGym) + Tab bar (5 abas)
- [x] Cliente Supabase + auth store (Zustand)
- [x] Schema SQL inicial com RLS
- [x] `app.json` com permissões iOS/Android para localização
- [ ] Google OAuth (próximo: `expo-auth-session`)
- [ ] Tela de check-in (GPS + timer de 15 min)
- [ ] Listagem real de batalhas
- [ ] Edge Functions: validação de check-in, job de meia-noite (dano + no-show)

Roadmap completo na seção 10 do conceito.
