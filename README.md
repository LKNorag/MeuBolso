# 💜 Meu Bolso

Aplicativo de controle financeiro pessoal feito com **React Native + Expo Router**.

Desenvolvido por **Luis Arthur Kawano** — luisarthurkawano@gmail.com

## Funcionalidades

- **Cadastro de usuário** (nome, e-mail, senha e confirmação, com validação)
- **Login** com verificação de e-mail e senha
- **Sessão salva**: ao abrir o app de novo, você continua logado
- **Tela inicial** com saldo, total de receitas e total de despesas
- **Cadastro de lançamentos** (receita ou despesa, descrição, valor e categoria)
- **Filtro** por Todos / Receitas / Despesas
- **Exclusão** de lançamentos
- **Sair** da conta

Os dados ficam salvos no próprio aparelho/navegador usando `AsyncStorage`.

## Estrutura

```
app/
  _layout.js              -> navegação principal (Stack)
  index.js                -> tela de login
  register.js             -> tela de cadastro de usuário
  (app)/
    _layout.js            -> navegação da área logada
    home.js               -> saldo + lista de lançamentos
    new-transaction.js    -> cadastro de receita/despesa
src/
  components/             -> AppInput e AppButton
  constants/theme.js      -> cores, espaçamentos e bordas
  services/storage.js     -> usuários, sessão e lançamentos
  utils/helpers.js        -> formatação de dinheiro/data e alertas
```

## Como rodar

```bash
npm install
npx expo start
```

- Aperte **w** para abrir no navegador
- Ou leia o QR Code com o app **Expo Go** no celular
