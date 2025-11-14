# Price Stocker Transactions API (v1)

## List transactions

GET /api/v1/transactions?user_id=UUID&limit=50&cursor=...

Headers:

- x-ps-api-key: TEST_123
- content-type: application/json

### Example (curl)

curl -H "x-ps-api-key: TEST_123" \
 "https://<YOUR-PROJECT>.functions.supabase.co/transactions?user_id=3786bdb1-c9bc-4124-aee5-d249ebbd4dbc&limit=50"

### Response

{
"data": [ { "id":"...", "user_id":"...", "ticker":"BTCUSDT", "side":"buy", "quantity":"0.1", "price":"68000", "fee":"1.2", "effective_at":"...", "created_at":"...", "meta":{} } ],
"next_cursor": null
}

### Errors

401 Missing or invalid API key
400 Bad request (e.g., missing user_id)
