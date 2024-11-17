import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/",
  async () => {
    return {
      status: 200,
      data: await prismaClient.message.findMany({
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              iconUrl: true,
              bannerUrl: true,
              location: true,
              headline: true,
              isAdmin: true,
            },
          },
          mentionedBy: true,
          mentionedTo: {
            select: {
              id: true,
              message: true,
              user: {
                select: {
                  name: true,
                },
              },
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
);
