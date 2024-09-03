import { t } from "elysia";

import { createElysia } from "@utils/createElysia";
import { WorkService } from "./work.service";
import { WorkWithResponsibilitySchema } from "./work.schema";

const workService = new WorkService();

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
  .get("/", async () => {
    return {
      status: 200,
      data: await workService.getAllWork(),
    };
  })
  .get("/:id", async ({ params: { id } }) => {
    return {
      status: 200,
      data: await workService.getWorkById(parseInt(id)),
    };
  })
  .post(
    "/",
    async ({ body }: { body: Omit<WorkWithResponsibilitySchema, "id"> }) => {
      const {
        logo,
        jobTitle,
        responsibilities,
        address,
        instance,
        instanceLink,
        date,
      } = body;
      return await workService.createWork({
        logo,
        jobTitle,
        responsibilities,
        address,
        instance,
        instanceLink,
        date,
      });
    },
    {
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
  .delete("/:id", async ({ params: { id } }) => {
    await workService.deleteWork(parseInt(id));
    return {
      status: 200,
      message: "Work and related responsibilities deleted successfully",
    };
  })
  .patch(
    "/:id",
    async ({
      params: { id },
      body,
    }: {
      params: { id: string };
      body: WorkWithResponsibilitySchema;
    }) => {
      const {
        logo,
        jobTitle,
        responsibilities,
        address,
        instance,
        instanceLink,
        date,
      } = body;

      const updatedWork = await workService.updateWork(parseInt(id), {
        logo,
        jobTitle,
        responsibilities,
        address,
        instance,
        instanceLink,
        date,
      });

      return updatedWork;
    }
  );
