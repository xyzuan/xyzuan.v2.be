import { describe, expect, it } from "bun:test";
import { api } from "../src";

describe("Collection Modules", () => {
  it("Return a all collection list", async () => {
    const response = await api
      .handle(new Request("http://localhost:3121/v2/collection"))
      .then(async (res) => await res.json());

    expect(response).toHaveProperty("data");
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("Return a collection by id", async () => {
    const all = await api
      .handle(new Request("http://localhost:3121/v2/collection"))
      .then(async (res) => await res.json());
    const first = all.data?.[0];
    if (!first) return;

    const response = await api
      .handle(new Request(`http://localhost:3121/v2/collection/${first.id}`))
      .then(async (res) => await res.json());

    expect(response).toHaveProperty("data");
    expect(response.data).toHaveProperty("id", first.id);
    expect(response.data).toHaveProperty("title");
    expect(response.data).toHaveProperty("storeName");
    expect(response.data).toHaveProperty("category");
    expect(response.data).toHaveProperty("price");
  });

  it("Return 404 envelope for a missing collection id", async () => {
    const response = await api
      .handle(new Request("http://localhost:3121/v2/collection/999999"))
      .then(async (res) => ({ status: res.status, body: await res.json() }));

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(404);
    expect(response.body.data).toBeNull();
  });

  it("Reject unauthenticated POST with 401", async () => {
    const response = await api
      .handle(
        new Request("http://localhost:3121/v2/collection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost:3000",
            Host: "localhost:3121",
          },
          body: JSON.stringify({
            image: "https://example.com/img.png",
            title: "Test",
            description: "desc",
            affiliateLink: "https://shopee.co.id/test",
            price: 1000,
            storeName: "SHOPEE",
            category: "GADGETS",
            isFeatured: false,
          }),
        })
      )
      .then(async (res) => ({ status: res.status, body: await res.json() }));

    expect(response.status).toBe(401);
  });
});
