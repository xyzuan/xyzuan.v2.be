import { Work } from "@prisma/client";
import { prismaClient } from "../../libs/prismaDatabase";
import { UpdateWorkData, WorkWithResponsibilitySchema } from "./work.schema";

export class WorkService {
  async createWork({
    logo,
    jobTitle,
    responsibilities,
    address,
    instance,
    instanceLink,
    date,
  }: Omit<WorkWithResponsibilitySchema, "id">): Promise<Work> {
    return prismaClient.work.create({
      data: {
        logo,
        jobTitle,
        address,
        instance,
        instanceLink,
        date,
        responsibilities: {
          create: responsibilities.map((description: string) => ({
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
  }

  async getWorkById(id: number): Promise<Work | null> {
    return prismaClient.work.findUnique({
      where: { id },
      include: {
        responsibilities: true,
      },
    });
  }

  async getAllWork(): Promise<Work[]> {
    return prismaClient.work.findMany({
      include: {
        responsibilities: true,
      },
    });
  }

  async updateWork(id: number, data: UpdateWorkData): Promise<Work> {
    let updatedData: any = { ...data };

    if (data.responsibilities) {
      updatedData.responsibilities = {
        deleteMany: {},
        create: data.responsibilities.map((description) => ({
          description,
        })),
      };
    }

    return prismaClient.work.update({
      where: { id },
      data: { ...updatedData },
      include: {
        responsibilities: true,
      },
    });
  }

  async deleteWork(id: number): Promise<Work> {
    return prismaClient.work.delete({
      where: { id },
    });
  }
}
