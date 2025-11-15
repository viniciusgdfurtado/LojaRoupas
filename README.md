
# 🐳 Deploy com Docker e Portainer

Este guia explica como executar a aplicação de Vitrine de Loja de Roupas usando Docker e Portainer, ou localmente com Node.js.

## 📋 Pré-requisitos

### Para Docker:
- Docker instalado
- Docker Compose instalado
- Portainer configurado (opcional)
- Acesso às credenciais AWS S3 (se usar storage hospedado)

### Para execução local:
- Node.js 18+ instalado
- PostgreSQL instalado e rodando (ou usar banco hospedado)
- npm ou yarn instalado

---

## 🖥️ Executar Localmente com Node.js (Sem Docker)

### 1. Instalar Dependências

```bash
cd nextjs_space
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Banco de Dados - Opção 1: Banco Hospedado (Recomendado)
DATABASE_URL="postgresql://role_cfe789e42:kAoCqD7W_KSegPTKQl8v2O6TF1TtQKZh@db-cfe789e42.db003.hosteddb.reai.io:5432/cfe789e42?connect_timeout=15"

# Banco de Dados - Opção 2: PostgreSQL Local
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/loja_roupas"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# AWS S3 (opcional)
AWS_ACCESS_KEY_ID="sua-access-key"
AWS_SECRET_ACCESS_KEY="sua-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="seu-bucket"
```

### 3. Configurar Banco de Dados

Se estiver usando PostgreSQL local, crie o banco:

```bash
# Acesse o PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE loja_roupas;

# Crie um usuário (opcional)
CREATE USER loja_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE loja_roupas TO loja_user;
```

### 4. Executar Migrations

```bash
npx prisma migrate deploy
```

Ou para desenvolvimento:

```bash
npx prisma migrate dev
```

### 5. Popular o Banco (Seed)

```bash
npx prisma db seed
```

### 6. Iniciar a Aplicação

**Modo Desenvolvimento:**
```bash
npm run dev
```

**Modo Produção:**
```bash
npm run build
npm start
```

### 7. Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/auth/login

**Credenciais de Teste:**
- Email: admin@loja.com
- Senha: admin123

### Comandos Úteis (Local)

```bash
# Gerar cliente Prisma após mudanças no schema
npx prisma generate

# Abrir Prisma Studio (interface visual do banco)
npx prisma studio

# Resetar banco de dados (cuidado!)
npx prisma migrate reset

# Verificar status das migrations
npx prisma migrate status

# Formatar código
npm run lint
```

---

## 🚀 Opções de Deploy com Docker

### Opção 1: Usando Banco de Dados Hospedado (Recomendado)

Esta opção usa o banco de dados já configurado e hospedado pela plataforma.

1. **Copie o arquivo de ambiente:**
```bash
cp .env.example .env
```

2. **O arquivo `.env` já está configurado com o banco hospedado**

3. **Inicie os containers:**
```bash
docker-compose up -d
```

### Opção 2: Usando PostgreSQL Local

Esta opção cria um container PostgreSQL local.

1. **Copie o arquivo de ambiente:**
```bash
cp .env.example .env
```

2. **Edite o `.env` e comente/descomente as linhas:**
```env
# Comentar esta linha:
# DATABASE_URL="postgresql://role_cfe789e42:kAoCqD7W_KSegPTKQl8v2O6TF1TtQKZh@db-cfe789e42.db003.hosteddb.reai.io:5432/cfe789e42?connect_timeout=15"

# Descomentar esta linha:
DATABASE_URL="postgresql://loja_user:loja_password@postgres:5432/loja_roupas"
```

3. **Inicie os containers:**
```bash
docker-compose up -d
```

## 🎯 Deploy no Portainer

### Método 1: Via Stack (Recomendado)

1. **Acesse seu Portainer**
2. **Vá em Stacks → Add Stack**
3. **Nomeie a stack:** `loja-roupas-vitrine`
4. **Escolha "Upload from computer"** ou **"Repository"**
5. **Faça upload do `docker-compose.yml`**
6. **Configure as variáveis de ambiente:**
   - Clique em "Advanced mode"
   - Cole o conteúdo do arquivo `.env`
7. **Clique em "Deploy the stack"**

### Método 2: Via Git Repository

1. **Acesse Portainer → Stacks → Add Stack**
2. **Escolha "Repository"**
3. **Configure:**
   - Repository URL: [URL do seu repositório]
   - Repository reference: main/master
   - Compose path: docker-compose.yml
4. **Adicione as variáveis de ambiente**
5. **Deploy**

### Método 3: Via Docker CLI (Manual)

```bash
# Clone/copie o projeto para seu servidor
cd /caminho/para/loja_roupas_vitrine

# Configure o .env
cp .env.example .env
nano .env  # Edite conforme necessário

# Build e start
docker-compose up -d

# Verifique os logs
docker-compose logs -f app
```

## 🔧 Comandos Úteis

### Verificar status dos containers:
```bash
docker-compose ps
```

### Ver logs em tempo real:
```bash
docker-compose logs -f app
```

### Parar os containers:
```bash
docker-compose down
```

### Rebuild após mudanças:
```bash
docker-compose up -d --build
```

### Executar migrations manualmente:
```bash
docker-compose exec app npx prisma migrate deploy
```

### Executar seed (popular banco):
```bash
docker-compose exec app npx prisma db seed
```

### Acessar shell do container:
```bash
docker-compose exec app sh
```

### Limpar tudo e recomeçar:
```bash
docker-compose down -v  # Remove volumes também
docker-compose up -d --build
```

## 🌐 Acessar a Aplicação

Após o deploy bem-sucedido:

- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/auth/login

### Credenciais de Teste:
- **Email:** admin@loja.com
- **Senha:** admin123

## ⚙️ Configurações Importantes

### Portas

Por padrão, a aplicação usa:
- **App:** 3000
- **PostgreSQL:** 5432

Para alterar, edite no `.env`:
```env
APP_PORT=8080
POSTGRES_PORT=5433
```

### Volumes

Os dados do PostgreSQL são persistidos no volume `postgres_data`.

### Networks

Todos os serviços estão na rede `loja_network` para comunicação interna.

## 🔒 Segurança

### Produção

Para ambientes de produção:

1. **Mude o `NEXTAUTH_SECRET`:**
```bash
openssl rand -base64 32
```

2. **Use senhas fortes para PostgreSQL**

3. **Configure HTTPS/SSL**

4. **Configure o `NEXTAUTH_URL` correto:**
```env
NEXTAUTH_URL=https://seu-dominio.com
```

5. **Não exponha a porta do PostgreSQL:**
```yaml
# Remova ou comente no docker-compose.yml:
# ports:
#   - "5432:5432"
```

## 🐛 Troubleshooting

### Problema: App não inicia

**Solução:** Verifique os logs
```bash
docker-compose logs app
```

### Problema: Erro de conexão com banco

**Solução:** Verifique se o PostgreSQL está rodando
```bash
docker-compose ps postgres
docker-compose logs postgres
```

### Problema: Imagens não aparecem

**Solução:** Verifique as credenciais AWS no `.env`

### Problema: Porta já em uso

**Solução:** Mude a porta no `.env`
```env
APP_PORT=3001
```

## 📊 Monitoramento

### Health Checks

A aplicação possui health checks configurados:
- **App:** http://localhost:3000/api/health
- **PostgreSQL:** Verificação automática via `pg_isready`

### Logs

Para monitorar logs de forma contínua:
```bash
# Todos os serviços
docker-compose logs -f

# Apenas app
docker-compose logs -f app

# Apenas postgres
docker-compose logs -f postgres
```

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
# 1. Baixe as mudanças
git pull

# 2. Rebuild
docker-compose up -d --build

# 3. Execute migrations se houver
docker-compose exec app npx prisma migrate deploy
```

## 📦 Backup

### Backup do Banco de Dados:
```bash
docker-compose exec postgres pg_dump -U loja_user loja_roupas > backup.sql
```

### Restaurar Backup:
```bash
docker-compose exec -T postgres psql -U loja_user loja_roupas < backup.sql
```

## 🎉 Pronto!

Sua aplicação de Vitrine de Loja de Roupas está rodando em containers Docker e pode ser gerenciada facilmente pelo Portainer!

### Recursos:
- ✅ Isolamento completo em containers
- ✅ Fácil deploy e rollback
- ✅ Persistência de dados
- ✅ Health checks automáticos
- ✅ Logs centralizados
- ✅ Escalabilidade horizontal

---

**Suporte:** Em caso de dúvidas, verifique os logs ou abra uma issue.
