# 💜 Meu Bolso

Aplicativo de controle financeiro pessoal feito com **React Native + Expo Router**.

Desenvolvido por **Luis Arthur Kawano** — luisarthurkawano@gmail.com

## Funcionalidades

- **Cadastro de usuário** (nome, e-mail, senha e confirmação, com validação)
- **Login** com verificação de e-mail e senha

As contas ficam salvas no **Supabase** (Supabase Auth).

## Configuração do Supabase

Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como modelo):

```
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=SUA_CHAVE_PUBLICA
```

O script do banco está em `supabase/schema.sql`.

## Estrutura

```
app/
  _layout.js              -> navegação (Stack)
  index.js                -> tela de login
  register.js             -> tela de cadastro de usuário
src/
  components/             -> AppInput e AppButton
  constants/theme.js      -> cores, espaçamentos e bordas
  lib/supabase.js         -> conexão com o Supabase
  services/auth.js        -> cadastro e login de usuários (Supabase Auth)
  utils/helpers.js        -> validação de e-mail e alertas
```

## Como rodar

```bash
npm install
npx expo start
```

- Aperte **w** para abrir no navegador
- Ou leia o QR Code com o app **Expo Go** no celular
