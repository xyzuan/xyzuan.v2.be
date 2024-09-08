import { createElysia } from "@libs/elysia";
import { t } from "elysia";
import { authGuard } from "@libs/authGuard";
import { prismaClient } from "@libs/prismaDatabase";

export const MessageController = createElysia()
  .get(
    "/",
    async () => {
      return {
        status: 200,
        data: await prismaClient.message.findMany({
          include: {
            user: {
              select: {
                name: true,
                email: true,
                iconUrl: true,
              },
            },
          },
        }),
      };
    },
    {
      detail: {
        tags: ["Messages"],
      },
    }
  )
  .use(authGuard)
  .post(
    "/",
    async ({ body: { message }, user }) => {
      return {
        status: 200,
        data: await prismaClient.message.create({
          data: {
            message,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        }),
      };
    },
    {
      detail: {
        tags: ["Messages"],
      },
      body: t.Object({
        message: t.String(),
      }),
    }
  );
