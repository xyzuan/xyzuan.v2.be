import { createElysia } from "@libs/elysia";
import { t } from "elysia";
import { authGuard } from "@libs/authGuard";
import { prismaClient } from "@libs/prismaDatabase";
import { UnauthorizedException } from "@constants/exceptions";

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
  )
  .delete(
    "/:id",
    async ({ params: { id }, user }) => {
      const message = await prismaClient.message.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });

      if (!message) {
        return {
          status: 404,
          data: { message: "Message not found" },
        };
      }

      if (message.userId !== user.id && !user.isAdmin) {
        throw new UnauthorizedException();
      }

      await prismaClient.message.delete({
        where: {
          id: id,
        },
      });

      return {
        status: 200,
        data: { message: "Message deleted successfully" },
      };
    },
    {
      detail: {
        tags: ["Messages"],
      },
    }
  );
