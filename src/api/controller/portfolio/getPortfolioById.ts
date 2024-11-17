import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/:id",
  async ({ params: { id }, redis }) => {
    let portfolioData;
    const redisPortfolioData = await redis.get(`portfolio.${id}`);
    if (!redisPortfolioData) {
      const portfolio = await prismaClient.portfolio.findUnique({
        where: { id: parseInt(id) },
        include: {
          stacks: true,
        },
      });
      portfolioData = portfolio;
      await redis.set(`portfolio.${id}`, JSON.stringify(portfolio), 1440);
    } else {
      portfolioData = JSON.parse(redisPortfolioData);
    }

    return {
      status: 200,
      data: portfolioData,
    };
  },
  {
    detail: {
      tags: ["Portfolios"],
    },
  }
);
