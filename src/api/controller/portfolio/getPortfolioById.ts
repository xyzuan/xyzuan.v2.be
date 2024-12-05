import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { redis } from "@libs/redisClient";

export default createElysia().get(
  "/:id",
  async ({ params: { id } }) => {
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
      await redis.set(`portfolio.${id}`, JSON.stringify(portfolio));
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
