import { describe, expect, it } from "bun:test";
import { api } from "../src";

describe("Chat Modules", () => {
  it("Show chat item, chat information & user information", async () => {
    const response = await api
      .handle(new Request("http://localhost:3121/v2/message"))
      .then(async (res) => await res.json());

    expect(response).toHaveProperty("status", 200);
    expect(response).toHaveProperty("data");
    expect(Array.isArray(response.data)).toBe(true);

    if (response.data.length > 0) {
      const message = response.data[0];

      expect(message).toHaveProperty("id");
      expect(message).toHaveProperty("user");
      expect(message).toHaveProperty("mentionedBy");
      expect(message).toHaveProperty("mentionedTo");
      expect(message).toHaveProperty("createdAt");

      expect(message.user).toHaveProperty("id");
      expect(message.user).toHaveProperty("name");
      expect(message.user).toHaveProperty("email");
      expect(message.user).toHaveProperty("iconUrl");
      expect(message.user).toHaveProperty("isAdmin");

      if (message?.mentionedTo?.length > 0) {
        const mentioned = message.mentionedTo[0];
        expect(mentioned).toHaveProperty("id");
        expect(mentioned).toHaveProperty("message");
        expect(mentioned).toHaveProperty("user");
        expect(mentioned.user).toHaveProperty("name");
      }
    }
  });
});

//   it("Should create a message and receive it via WebSocket", async (done) => {
//     const ws = treaty<typeof api>("localhost:3000");
//     const chat = api.subscribe()

//     ws.onopen = () => {
//       ws.send(
//         JSON.stringify({
//           action: "CREATE",
//           message: "Hello, world!",
//         })
//       );
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       expect(data).toHaveProperty("id");
//       expect(data).toHaveProperty("message", "Hello, world!");
//       expect(data).toHaveProperty("user");

//       ws.close();
//       done();
//     };

//     ws.onerror = (err) => {
//       ws.close();
//       done(err);
//     };
//   });
// });
