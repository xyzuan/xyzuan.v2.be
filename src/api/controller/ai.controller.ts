import { t } from "elysia";

import { createElysia } from "@libs/elysia";
import { authGuard } from "@libs/authGuard";
import { ChatCompletionResponse, Message } from "@t/ai.types";
import { prismaClient } from "@libs/prismaDatabase";

export const AIController = createElysia()
  .model({
    "ai.req.model": t.Object({
      msg: t.String(),
      aiChatId: t.Optional(t.String()),
    }),
  })
  .use(authGuard)
  .get(
    "/",
    async ({ user }) => {
      const aiChats = await prismaClient.aIChat.findMany({
        where: {
          userId: user.id,
        },
        select: {
          userId: false,
          chatTitle: true,
          id: true,
          createdAt: true,
        },
      });

      return {
        status: 200,
        data: aiChats,
      };
    },
    {
      detail: {
        tags: ["AI"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, user }) => {
      const aiChat = await prismaClient.aIChat.findUnique({
        where: {
          id,
          userId: user.id,
        },
        select: {
          chatTitle: true,
          messages: true,
        },
      });

      return {
        status: 200,
        data: aiChat,
      };
    },
    {
      detail: {
        tags: ["AI"],
      },
    }
  )
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
        tags: ["AI"],
      },
    }
  );
