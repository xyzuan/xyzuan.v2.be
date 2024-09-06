import { Portfolio } from "@prisma/client";
import { prismaClient } from "../../libs/prismaDatabase";
import {
  PortfolioWithStackSchema,
  UpdatePortfolioData,
} from "./portfolio.schema";

export class PortfolioService {
  async createPortfolio({
    description,
    content,
    href,
    projectLink,
    img,
    title,
    stacks,
    isFeatured,
    createdAt,
  }: Omit<PortfolioWithStackSchema, "id">): Promise<Portfolio> {
    return prismaClient.portfolio.create({
      data: {
        description,
        content,
        href,
        projectLink,
        img,
        title,
        isFeatured,
        stacks: {
          create: stacks.map((description: string) => ({
            description,
          })),
        },
        createdAt,
      },
      select: {
        id: true,
        title: true,
        content: true,
        description: true,
        href: true,
        projectLink: true,
        img: true,
        isFeatured: true,
        stacks: {
          select: {
            id: true,
            description: true,
          },
        },
        createdAt: true,
      },
    });
  }

  async getPortfolioById(id: number): Promise<Portfolio | null> {
    return prismaClient.portfolio.findUnique({
      where: { id },
      include: {
        stacks: true,
      },
    });
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return prismaClient.portfolio.findMany({
      include: {
        stacks: true,
      },
      orderBy: [
        {
          isFeatured: "desc",
        },
      ],
    });
  }

  async updatePortfolio(
    id: number,
    data: UpdatePortfolioData
  ): Promise<Portfolio> {
    let updatedData: any = { ...data };
    if (data.stacks) {
      updatedData.stacks = {
        deleteMany: {},
        create: data.stacks.map((description) => ({
          description,
        })),
      };
    }

    return prismaClient.portfolio.update({
      where: { id },
      data: { ...updatedData },
      include: {
        stacks: true,
      },
    });
  }

  async deletePortfolio(id: number): Promise<Portfolio> {
    return prismaClient.portfolio.delete({
      where: { id },
    });
  }
}
