import { t } from "elysia";

import { createElysia } from "@libs/elysia";
import { authGuard } from "@libs/authGuard";
import { prismaClient } from "@libs/prismaDatabase";

export const WorkController = createElysia()
  .model({
    "work.model": t.Object({
      logo: t.String(),
      jobTitle: t.String(),
      responsibilities: t.Array(t.String()),
      address: t.String(),
      instance: t.String(),
      instanceLink: t.String(),
      date: t.String(),
    }),
  })
  .get(
    "/",
    async () => {
      return {
        status: 200,
        data: await prismaClient.work.findMany({
          include: {
            responsibilities: true,
          },
        }),
      };
    },
    {
      detail: {
        tags: ["Works"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return {
        status: 200,
        data: await prismaClient.work.findUnique({
          where: { id: parseInt(id) },
          include: {
            responsibilities: true,
          },
        }),
      };
    },
    {
      detail: {
        tags: ["Works"],
      },
    }
  )
  .use(authGuard)
  .post(
    "/",
    async ({ body }) => {
      return await prismaClient.work.create({
        data: {
          ...body,
          responsibilities: {
            create: body.responsibilities.map((description: string) => ({
              description,
            })),
          },
        },
        select: {
          id: true,
          logo: true,
          jobTitle: true,
          address: true,
          instance: true,
          instanceLink: true,
          date: true,
          responsibilities: {
            select: {
              id: true,
              description: true,
            },
          },
        },
      });
    },
    {
      detail: {
        tags: ["Works"],
      },
      body: "work.model",
      response: t.Object({
        id: t.Number(),
        logo: t.String(),
        jobTitle: t.String(),
        instance: t.String(),
        instanceLink: t.String(),
        address: t.String(),
        date: t.String(),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await prismaClient.work.delete({
        where: { id: parseInt(id) },
      });
      return {
        status: 200,
        message: "Work and related responsibilities deleted successfully",
      };
    },
    {
      detail: {
        tags: ["Works"],
      },
    }
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      let updatedData: any = { ...body };

      if (body.responsibilities) {
        updatedData.responsibilities = {
          deleteMany: {},
          create: body.responsibilities.map((description) => ({
            description,
          })),
        };
      }
      await prismaClient.work.update({
        where: { id: parseInt(id) },
        data: { ...updatedData },
        include: {
          responsibilities: true,
        },
      });
      return {
        status: 200,
        message: "Work and related responsibilities updated successfully",
      };
    },
    {
      body: "work.model",
      detail: {
        tags: ["Works"],
      },
    }
  );
