import { describe, expect, it } from "bun:test";
import { api } from "../src";

describe("Blog Modules", () => {
  it("Return a all blog list", async () => {
    const response = await api
      .handle(new Request("http://localhost:3121/v2/blog"))
      .then(async (res) => await res.json());

    expect(response).toHaveProperty("data");
    expect(Array.isArray(response.data)).toBe(true);

    const blog = response.data[0];
    expect(blog).toHaveProperty("id");
    expect(blog).toHaveProperty("title");
    expect(blog).toHaveProperty("content");
    expect(blog).toHaveProperty("commentsCount");
    expect(blog).toHaveProperty("reactionsCount");

    expect(blog.commentsCount).toBeGreaterThanOrEqual(0);
    expect(blog.reactionsCount).toBeGreaterThanOrEqual(0);
  });
});
