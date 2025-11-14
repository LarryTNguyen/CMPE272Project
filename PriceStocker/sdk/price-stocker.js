export class PriceStocker {
  constructor({ apiKey, baseUrl }) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }
  async listTransactions({ userId, limit = 50, cursor, ...filters }) {
    const qs = new URLSearchParams({ user_id: userId, limit, ...filters });
    if (cursor) qs.set("cursor", cursor);
    const res = await fetch(`${this.baseUrl}/transactions?${qs.toString()}`, {
      headers: { "x-ps-api-key": this.apiKey }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}
