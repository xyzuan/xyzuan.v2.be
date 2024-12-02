import { describe, expect, it } from "bun:test";
import { api } from "../src";
import { generateRandomEmail } from "@utils/mockUtils";

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

describe("/v2/signup Auth Sign Up", () => {
  it("should return 201 if user can register with valid data", async () => {
    const response = await api
      .handle(
        new Request("http://localhost:3121/v2/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: generateRandomEmail(),
            password: "password123",
            name: "Random User",
          }),
        })
      )
      .then(async (res) => ({
        status: res.status,
        body: await res.json(),
      }));

    expect(response.status).toBe(201);
  });

  it("should return 422 if email or password is missing", async () => {
    const response = await api
      .handle(
        new Request("http://localhost:3121/v2/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
          }),
        })
      )
      .then(async (res) => ({
        status: res.status,
        body: await res.json(),
      }));

    expect(response.status).toBe(422);
  });

  it("should return 422 if password is missing", async () => {
    const response = await api
      .handle(
        new Request("http://localhost:3121/v2/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            name: "Test User",
          }),
        })
      )
      .then(async (res) => ({
        status: res.status,
        body: await res.json(),
      }));

    expect(response.status).toBe(422);
  });

  it("should return 422 if email is missing", async () => {
    const response = await api
      .handle(
        new Request("http://localhost:3121/v2/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: "password123",
            name: "Test User",
          }),
        })
      )
      .then(async (res) => ({
        status: res.status,
        body: await res.json(),
      }));

    expect(response.status).toBe(422);
  });
});
