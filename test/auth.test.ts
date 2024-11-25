import { describe, expect, it } from "bun:test";
import { api } from "../src";

describe("/v2/login Auth Sign In", () => {
  it("If Email / Password cant be null", async () => {
    const response = await api
      .handle(
        new Request("http://localhost:3121/v2/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      )
      .then(async (res) => ({
        status: res.status,
        body: await res.json(),
      }));

    expect(response.status).toBe(400);
  });

  it("If Email & Password are valid, system give the auth-session", async () => {
    const response = await api
      .handle(
        new Request("http://localhost:3121/v2/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@xyzuan.my.id",
            password: "testakun123",
          }),
        })
      )
      .then(async (res) => ({
        status: res.status,
        body: await res.json(),
      }));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });

  it("If Email & Password are not valid, system give the failed message", async () => {
    const response = await api
      .handle(
        new Request("http://localhost:3121/v2/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@xyzuan.my.id",
            password: "invalidpassword",
          }),
        })
      )
      .then(async (res) => ({
        status: res.status,
        body: await res.json(),
      }));

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is invalid.");
  });
});
