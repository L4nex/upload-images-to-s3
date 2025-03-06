# 📦 Lambda Zip Upload

AWS Lambda para upload, extração e armazenamento de imagens em um bucket S3, com autenticação JWT para controle de acesso.

## 🚀 Funcionalidades

✅ **Upload seguro** de arquivos ZIP contendo imagens  
✅ **Extração automática** das imagens dentro do ZIP  
✅ **Armazenamento no Amazon S3**  
✅ **Proteção com JWT** para garantir segurança no acesso

---

## 📌 Pré-requisitos

- **Node.js** v22
- **Yarn** (Gerenciador de pacotes)

---

## 📥 Entradas

### 🔹 Upload de Imagens

- O arquivo enviado **deve ser um ZIP** contendo imagens.
- As imagens podem estar organizadas dentro de pastas.
- A requisição deve ser **multipart/form-data**, com o campo do arquivo nomeado como `file`.

### 🔹 Autenticação

- Para realizar o upload, é necessário um **token JWT válido**.
- O token deve ser enviado no cabeçalho da requisição:

  ```http
  Authorization: Bearer <seu_token_jwt>
  ```

- O token pode ser gerado chamando a função `generate-token-handler`, fornecendo um **usuário e senha válidos**.

---

## 📂 Estrutura do Projeto

📁 **src/**  
├── 📜 `handler.ts` → Função principal do Lambda (upload, extração e envio ao S3)  
├── 📜 `extract-zip.ts` → Extrai imagens do arquivo ZIP  
├── 📜 `upload.ts` → Faz o upload das imagens extraídas para o S3  
├── 📜 `generate-token-handler.ts` → Gera um token JWT com usuário e senha  
└── 📜 `auth-middleware.ts` → Middleware para validar o JWT

---

## 📦 Dependências

| Pacote         | Descrição                              |
| -------------- | -------------------------------------- |
| `aws-sdk`      | Interação com serviços da AWS          |
| `busboy`       | Processamento de formulários multipart |
| `unzipper`     | Extração de arquivos ZIP               |
| `jsonwebtoken` | Geração e validação de tokens JWT      |

---

## ⚙️ Configuração e Deploy

### 🔹 1. Instalar dependências

```sh
yarn install
```

### 🔹 2. Build e empacotamento dos Lambdas

#### **Lambda de Upload (`handler.ts`)**

```sh
npx tsc
zip -r upload.zip dist/auth-middleware.js dist/extract-zip.js dist/upload.js dist/handler.js node_modules
```

#### **Lambda de Geração de Token (`generate-token-handler.ts`)**

```sh
npx tsc
zip -r generate-token.zip dist/generate-token-handler.js node_modules
```

### 🔹 3. Configurar Variáveis de Ambiente

| Lambda                                  | Variáveis Requeridas                 |
| --------------------------------------- | ------------------------------------ |
| **Upload (`handler.ts`)**               | `S3_BUCKET_NAME`, `JWT_SECRET`       |
| **Token (`generate-token-handler.ts`)** | `JWT_SECRET`, `USERNAME`, `PASSWORD` |

### 🔹 4. Ajustes Recomendados no AWS Lambda

- **Ajustar memória** para **256MB ou 512MB** para melhor desempenho
- **Habilitar Provisioned Concurrency** para reduzir o tempo de cold start

---

## 🎯 Exemplo de Uso

### 🔹 Gerar Token JWT

```http
POST /sua-rota
Content-Type: application/json

{
  "username": "meu_usuario",
  "password": "minha_senha"
}
```

🔹 **Resposta esperada:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### 🔹 Upload de Arquivo ZIP

```http
POST /sua-rota
Authorization: Bearer <seu_token_jwt>
Content-Type: multipart/form-data
```

🔹 **Resposta esperada:**

```json
{
  "statusCode": 200,
  "body": {
    "message": "Upload concluído",
    "files": ["imagem1.jpg", "imagem2.png"]
  }
}
```

---

## 📌 Observações

- Certifique-se de que **as permissões do bucket S3 estejam corretas** para o upload.
- Tokens JWT **expiram** após um período de 12 horas – gere um novo quando necessário.
- Para fins de segurança, **nunca exponha o `JWT_SECRET` publicamente**.
