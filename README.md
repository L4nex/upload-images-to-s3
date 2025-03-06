# Lambda Zip Upload

Este projeto é uma função AWS Lambda que permite o upload de arquivos ZIP contendo imagens, extrai as imagens do arquivo ZIP e as envia para um bucket S3. Além disso, inclui um sistema de autenticação baseado em tokens JWT para proteger o acesso à função de upload.

## Pré-requisitos

- Node.js v22
- Yarn

## Entradas

- **Upload de Imagens**:

  - Espera um arquivo zipado contendo imagens que podem ou não estar organizadas dentro de pastas.
  - O corpo da requisição deve ser um `multipart/form-data`, com o nome do atributo do arquivo sendo `file`.

- **Autenticação**:
  - Para acessar a função de upload, é necessário fornecer um token JWT válido no cabeçalho `Authorization` da requisição.
  - O token pode ser gerado chamando o handler `generate-token-handler` com um usuário e senha válidos.

## Arquivos Principais

- **src/handler.ts**: Função Lambda principal que lida com o upload do arquivo ZIP, extração das imagens e upload para o S3.
- **src/extract-zip.ts**: Função que extrai imagens de um arquivo ZIP.
- **src/upload.ts**: Função que faz o upload das imagens extraídas para um bucket S3.
- **src/generate-token-handler.ts**: Função Lambda que gera um token JWT com base em um usuário e senha.
- **src/auth-middleware.ts**: Middleware que valida o token JWT antes de permitir o acesso à função de upload.

## Dependências

- `aws-sdk`: SDK da AWS para interagir com os serviços da AWS.
- `busboy`: Biblioteca para analisar formulários multipart.
- `unzipper`: Biblioteca para descompactar arquivos ZIP.
- `jsonwebtoken`: Biblioteca para gerar e validar tokens JWT.

## Configuração

1. **Instalar Dependências**:

   ```sh
   yarn install
   ```

2. **Deploy**

   - Para fazer upload dos lambdas é necessário:

     **src/handler.ts**
     rodar os comandos
     `npx tsc`
     `zip -r lambda.zip dist/auth-middleware.js dist/extract-zip.js dist/upload.js dist/handler.js node_modules`

     **src/generate-token-handler.ts**
     `zip -r generate-token.zip dist/generate-token-handler.js node_modules`

3. **Configurar Variáveis de Ambiente**:

   - Variáveis necessárias:

   **src/handler.ts** são necessárias as variáveis de ambiente `S3_BUCKET_NAME`, `JWT_SECRET`
   **src/generate-token-handler.ts** são necessárias as variáveis de ambiente `JWT_SECRET`, `USERNAME`, `PASSWORD`

4. **Sugestão de configuração do lambda**

   - Aumente a memória do Lambda para 256 MB ou 512 MB para melhorar o desempenho.
   - Configure Provisioned Concurrency para reduzir o tempo de cold start.
