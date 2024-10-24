import { t } from "elysia";

import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

const me = createElysia()
  .get("/:id", async ({ params: { id } }) => {
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
  })
  .use(authGuard)
  .get(
    "/",
    ({ user }) => {
      return user;
    },
    {
      detail: {
        tags: ["Users"],
      },
    }
  )
  .patch(
    "/",
    async ({ body, user }) => {
      let updatedData: any = body;
      await prismaClient.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...updatedData,
        },
      });

      return {
        status: 200,
        data: {
          message: "Profile Updated",
        },
      };
    },
    {
      detail: {
        tags: ["Users"],
      },
      body: t.Object({
        name: t.Optional(t.String()),
        about: t.Optional(t.String()),
        iconUrl: t.Optional(t.String()),
        bannerUrl: t.Optional(t.String()),
        headline: t.Optional(t.String()),
        location: t.Optional(t.String()),
      }),
    }
  );

export { me };
