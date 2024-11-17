import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia()
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
        tags: ["Tidy AI"],
      },
    }
  );
