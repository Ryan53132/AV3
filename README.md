# Aerocode - Sistema de Gerenciamento de Aeronaves

Sistema web para gerenciamento de aeronaves, incluindo controle de etapas de produção, peças, testes e funcionários.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js)
- **MySQL** (versão 8.0 ou superior)
- **Git** (opcional, para clonar o repositório)

## 🚀 Instalação

### 1. Clone o repositório (ou baixe o projeto)

```bash
git clone https://github.com/Ryan53132/AV3.git
cd av3
```

### 2. Instale as dependências

```bash
npm install
```

Este comando irá instalar todas as dependências necessárias para o frontend e backend.

### 3. Configure o banco de dados

#### 3.1. Crie um banco de dados MySQL

Acesse o MySQL e crie um banco de dados:

```sql
CREATE DATABASE aerocode;
```

#### 3.2. Configure a variável de ambiente

Crie um arquivo `.env` na raiz do projeto com a seguinte configuração:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/aerocode"
```

**Substitua:**
- `usuario` pelo seu usuário do MySQL
- `senha` pela sua senha do MySQL
- `localhost:3306` pelo host e porta do seu MySQL (se diferente)
- `aerocode` pelo nome do banco de dados criado

**Exemplo:**
```env
DATABASE_URL="mysql://root:minhasenha123@localhost:3306/aerocode"
```

### 4. Configure o Prisma

#### 4.1. Gere o cliente Prisma

```bash
npx prisma generate
```

Este comando gera o cliente Prisma baseado no schema definido.

OBS: Nas versões mais novas do Prisma (6.19+ e 7.x), o datasource não utiliza mais a propriedade `url` dentro do arquivo `schema.prisma`. Agora, o schema deve usar apenas `adapter = "mysql"`, enquanto a URL de conexão fica exclusivamente no arquivo `prisma.config.ts`. Caso você esteja utilizando uma versão mais antiga do Prisma, o formato tradicional com `provider` e `url` no schema ainda será aceito.


#### 4.2. Execute as migrações do banco de dados

```bash
npx prisma migrate deploy
```

Ou, se for a primeira vez:

```bash
npx prisma migrate dev
```

Este comando cria todas as tabelas necessárias no banco de dados.

## 🎯 Executando a Aplicação

### Opção 1: Executar tudo de uma vez (Recomendado)

O projeto possui um script que executa o servidor e o cliente simultaneamente:

```bash
npm run dev
```

Este comando irá:
- Iniciar o servidor Express na porta **3000**
- Iniciar o servidor Vite (frontend) na porta **5173**

### Opção 2: Executar separadamente

#### Terminal 1 - Servidor Backend:

```bash
npm run server
```

O servidor estará disponível em: `http://localhost:3000`

#### Terminal 2 - Frontend:

```bash
npm run client
```

O frontend estará disponível em: `http://localhost:5173`

## 📦 Popular o Banco de Dados (Opcional)

Após iniciar o servidor, você pode popular o banco de dados com dados de exemplo acessando:

```
http://localhost:3000/api/popula
```

Ou via curl:

```bash
curl http://localhost:3000/api/popula
```

Isso criará:
- Aeronaves de exemplo
- Etapas de produção
- Funcionários
- Peças
- Testes

## 🛠️ Scripts Disponíveis

- `npm run dev` - Executa servidor e cliente simultaneamente
- `npm run server` - Executa apenas o servidor backend
- `npm run client` - Executa apenas o frontend
- `npm run build` - Compila o projeto para produção
- `npm run lint` - Executa o linter para verificar código
- `npm run preview` - Visualiza a build de produção

## 📁 Estrutura do Projeto

```
av3/
├── server/           # Backend (Express + Prisma)
│   └── index.js     # Servidor principal
├── src/             # Frontend (React + Vite)
│   ├── pages/       # Páginas da aplicação
│   ├── components/  # Componentes React
│   └── lib/         # Utilitários
├── prisma/          # Configuração do Prisma
│   ├── schema.prisma # Schema do banco de dados
│   └── migrations/   # Migrações do banco
└── package.json     # Dependências e scripts
```

## 🔌 Endpoints da API

### GET
- `/api/selectAero` - Lista todas as aeronaves
- `/api/selectUsers` - Lista todos os funcionários
- `/api/popula` - Popula o banco com dados de exemplo

### POST
- `/api/login` - Autenticação de usuário
- `/api/select` - Busca detalhes de uma aeronave
- `/api/insert` - Insere novos registros (Aeronave, Etapa, Peça, Teste, Funcionário)
- `/api/update` - Atualiza registros (Etapa, Peça, Funcionário)
- `/api/delete` - Deleta registros (Etapa, Peça, Teste, Funcionário)

## 🗄️ Modelos do Banco de Dados

- **Aeronave**: Informações sobre as aeronaves
- **Etapa**: Etapas de produção das aeronaves
- **Funcionario**: Funcionários do sistema
- **Peca**: Peças utilizadas nas aeronaves
- **Teste**: Testes realizados nas aeronaves

## ⚠️ Troubleshooting

### Erro de conexão com o banco de dados

- Verifique se o MySQL está rodando
- Confirme se a `DATABASE_URL` no arquivo `.env` está correta
- Verifique se o banco de dados foi criado

### Erro ao executar migrações

```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Porta já em uso

Se a porta 3000 ou 5173 estiver em uso, você pode:
- Parar o processo que está usando a porta
- Modificar as portas nos arquivos de configuração

### Dependências não instaladas

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notas Importantes

- O servidor backend roda na porta **3000**
- O frontend roda na porta **5173**
- O frontend está configurado para fazer proxy das requisições `/api` para o backend
- Certifique-se de que o MySQL está rodando antes de iniciar a aplicação



