import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/:id",
  async ({ params: { id } }) => {
    return {
      status: 200,
      data: await prismaClient.user.findUnique({
        where: {
          id: id,
        },
        select: {
          name: true,
          email: true,
          iconUrl: true,
          bannerUrl: true,
          about: true,
          location: true,
          headline: true,
          isAdmin: true,
        },
      }),
    };
  },
  {
    detail: {
      tags: ["Users"],
    },
  }
);
