import { Portfolio } from "@prisma/client";
import { prisma } from "@utils/prismaDatabase";
import {
  PortfolioWithStackSchema,
  UpdatePortfolioData,
} from "./portfolio.schema";

export class PortfolioService {
  async createPortfolio({
    content,
    href,
    img,
    title,
    stacks,
  }: Omit<PortfolioWithStackSchema, "id">): Promise<Portfolio> {
    return prisma.portfolio.create({
      data: {
        content,
        href,
        img,
        title,
        stacks: {
          create: stacks.map((description: string) => ({
            description,
          })),
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        href: true,
        img: true,
        stacks: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    });
  }

  async getPortfolioById(id: number): Promise<Portfolio | null> {
    return prisma.portfolio.findUnique({
      where: { id },
      include: {
        stacks: true,
      },
    });
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return prisma.portfolio.findMany({
      include: {
        stacks: true,
      },
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

    return prisma.portfolio.update({
      where: { id },
      data: { ...updatedData },
      include: {
        stacks: true,
      },
    });
  }

  async deletePortfolio(id: number): Promise<Portfolio> {
    return prisma.portfolio.delete({
      where: { id },
    });
  }
}
