import { Prisma, Work } from "@prisma/client";

interface WorkWithResponsibilitySchema extends Work {
  responsibilities: string[];
}

type UpdateWorkData = Partial<Omit<WorkWithResponsibilitySchema, "id">> & {
  responsibilities?: Prisma.WorkResponsibilityUpdateManyWithoutWorkNestedInput;
};

export { WorkWithResponsibilitySchema, UpdateWorkData };
