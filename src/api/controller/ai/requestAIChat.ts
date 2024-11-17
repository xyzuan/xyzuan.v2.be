import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { ChatCompletionResponse, Message } from "@t/ai";
import aiModel from "@models/ai.model";

export default createElysia()
  .use(aiModel)
  .use(authGuard)
  .post(
    "/",
    async ({ body, user, env }) => {
      const { msg, aiChatId } = body;
      let previousMsg: Message[] = [];
      let responseAIChatId = aiChatId ?? "";

      if (aiChatId) {
        const chat = await prismaClient.aIChat.findUnique({
          where: {
            id: aiChatId,
            userId: user.id,
          },
          include: {
            messages: true,
          },
        });
        if (chat) {
          previousMsg = chat.messages.map((message) => ({
            role: message.role,
            content: message.msg,
          }));
        }
      }

      const ai: Promise<ChatCompletionResponse> = fetch(env.AZURE_AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": env.AZURE_AI_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            ...previousMsg,
            {
              role: "user",
              content: msg,
            },
          ],
        }),
      }).then(async (response) => await response.json());

      const { choices } = await ai;

      if (!aiChatId) {
        const createAIChat = await prismaClient.aIChat.create({
          data: {
            chatTitle: msg,
            userId: user.id,
            messages: {
              createMany: {
                data: [
                  {
                    msg,
                    role: "user",
                  },
                  {
                    msg: choices[0].message.content,
                    role: "assistant",
                  },
                ],
              },
            },
          },
        });
        responseAIChatId = createAIChat.id;
      } else {
        await prismaClient.aIChatMessage.createMany({
          data: [
            {
              aIChatId: aiChatId,
              msg,
              role: "user",
            },
            {
              aIChatId: aiChatId,
              msg: choices[0].message.content,
              role: "assistant",
            },
          ],
        });
      }

      return {
        status: 200,
        data: {
          id: responseAIChatId,
          result: choices[0].message.content,
        },
      };
    },
    {
      body: "ai.req.model",
      detail: {
        tags: ["Tidy AI"],
      },
    }
  );
