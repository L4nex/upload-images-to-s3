# Lambda Zip Upload

Este projeto é uma função AWS Lambda que permite o upload de arquivos ZIP contendo imagens, extrai as imagens do arquivo ZIP e as envia para um bucket S3.

## Prerequisites

- Node.js v22
- Yarn

## Entradas

- Espera um arquivo zipado contendo imagens que podem ou não estar organizadas dentro de pastas com o body sendo um multipart/form-data e o nome do atributo do arquivo sendo `file`

## Arquivos Principais

- **src/handler.ts**: Função Lambda principal que lida com o upload do arquivo ZIP, extração das imagens e upload para o S3.
- **src/extract-zip.ts**: Função que extrai imagens de um arquivo ZIP.
- **src/upload.ts**: Função que faz o upload das imagens extraídas para um bucket S3.

## Dependências

- `aws-sdk`: SDK da AWS para interagir com os serviços da AWS.
- `busboy`: Biblioteca para analisar formulários multipart.
- `unzipper`: Biblioteca para descompactar arquivos ZIP.

## Configuração

1. **Instalar Dependências**:

   ```sh
   yarn install
   ```

2. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto e defina a variável `S3_BUCKET_NAME` com o nome do bucket S3 onde as imagens serão armazenadas.

   ```
   S3_BUCKET_NAME=nome-do-seu-bucket