Aqui estão os comandos `curl` para testar os endpoints de **POST** e **PUT** criados:

---

### **1. Comando `curl` para Testar o Endpoint POST**

Este comando cria um novo filme no banco de dados:

```bash
curl -X POST http://localhost:3000/api/movies/request \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "payment_TX_ID": "tx_123456",
  "movie_creation_TX_ID": "tx_654321",
  "userAddress": "0x1234567890abcdef",
  "title": "Example Movie",
  "description": "This is an example description",
  "tags": "example, test",
  "thumbnails": ["https://example.com/thumbnail.jpg"],
  "category": "Entertainment",
  "creation_date": "2024-12-05",
  "REPLAY_TRACKING_URL": "https://example.com/hls.m3u8",
  "TX_ID": "tx_789012",
  "is_active": true
}'
```

#### **Resposta Esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "639dc2d0e9374e0012562d6b",
    "email": "user@example.com",
    "payment_TX_ID": "tx_123456",
    "movie_creation_TX_ID": "tx_654321",
    "userAddress": "0x1234567890abcdef",
    "title": "Example Movie",
    "description": "This is an example description",
    "tags": "example, test",
    "thumbnails": ["https://example.com/thumbnail.jpg"],
    "category": "Entertainment",
    "creation_date": "2024-12-05",
    "REPLAY_TRACKING_URL": "https://example.com/hls.m3u8",
    "TX_ID": "tx_789012",
    "is_active": true,
    "__v": 0
  }
}
```

---

### **2. Comando `curl` para Testar o Endpoint PUT**

Este comando atualiza um filme existente no banco de dados. Certifique-se de usar o `_id` do documento criado no teste do endpoint POST.

```bash
curl -X PUT http://localhost:3000/api/movies/request \
-H "Content-Type: application/json" \
-d '{
  "_id": "639dc2d0e9374e0012562d6b",
  "email": "updated_user@example.com",
  "payment_TX_ID": "tx_updated_123456",
  "movie_creation_TX_ID": "tx_updated_654321",
  "userAddress": "0x1234567890abcdef",
  "title": "Updated Movie Title",
  "description": "Updated description",
  "tags": "updated, example",
  "thumbnails": ["https://example.com/updated-thumbnail.jpg"],
  "category": "Updated Category",
  "creation_date": "2024-12-10",
  "REPLAY_TRACKING_URL": "https://example.com/updated-hls.m3u8",
  "TX_ID": "tx_updated_789012",
  "is_active": false
}'
```

#### **Resposta Esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "639dc2d0e9374e0012562d6b",
    "email": "updated_user@example.com",
    "payment_TX_ID": "tx_updated_123456",
    "movie_creation_TX_ID": "tx_updated_654321",
    "userAddress": "0x1234567890abcdef",
    "title": "Updated Movie Title",
    "description": "Updated description",
    "tags": "updated, example",
    "thumbnails": ["https://example.com/updated-thumbnail.jpg"],
    "category": "Updated Category",
    "creation_date": "2024-12-10",
    "REPLAY_TRACKING_URL": "https://example.com/updated-hls.m3u8",
    "TX_ID": "tx_updated_789012",
    "is_active": false,
    "__v": 0
  }
}
```

---

### **Notas para os Testes**

1. **Substitua `_id`:**
   - O valor de `_id` no comando PUT deve ser o ID retornado pelo POST.

2. **Substitua o URL do Servidor:**
   - Se o servidor estiver rodando em outro local (por exemplo, produção), substitua `http://localhost:3000` pelo URL correto.

3. **Execução no Terminal:**
   - Certifique-se de executar esses comandos no terminal onde você tem acesso à API.

4. **Validação Adicional:**
   - Se os endpoints retornarem erros de validação ou conexão, verifique os logs do servidor para identificar a causa.

---

Se precisar de mais ajuda, estou à disposição! 😊