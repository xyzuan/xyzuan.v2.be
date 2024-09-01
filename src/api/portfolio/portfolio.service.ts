import { Portfolio } from "@prisma/client";
import { prisma } from "@utils/prismaDatabase";

export class PortfolioService {
  async createPortfolio({
    content,
    href,
    img,
    title,
  }: Omit<Portfolio, "id">): Promise<Portfolio> {
    return prisma.portfolio.create({
      data: {
        content,
        href,
        img,
        title,
      },
      select: {
        id: true,
        title: true,
        content: true,
        href: true,
        img: true,
      },
    });
  }

  async getPortfolioById(id: number): Promise<Portfolio | null> {
    return prisma.portfolio.findUnique({
      where: { id },
    });
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return prisma.portfolio.findMany();
  }

  async updatePortfolio(
    id: number,
    data: Partial<Omit<Portfolio, "id">>
  ): Promise<Portfolio> {
    return prisma.portfolio.update({
      where: { id },
      data,
    });
  }

  async deletePortfolio(id: number): Promise<Portfolio> {
    return prisma.portfolio.delete({
      where: { id },
    });
  }
}
