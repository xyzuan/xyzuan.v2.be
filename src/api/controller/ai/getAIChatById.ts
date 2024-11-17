import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia()
  .use(authGuard)
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
        tags: ["Tidy AI"],
      },
    }
  );
