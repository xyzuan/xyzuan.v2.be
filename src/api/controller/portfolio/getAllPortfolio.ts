import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { redis } from "@libs/redisClient";

export default createElysia().get(
  "/",
  async () => {
    let portfolioData;
    const redisPortfolioData = await redis.get(`portfolio.all`);
    if (!redisPortfolioData) {
      const portfolio = await prismaClient.portfolio.findMany({
        include: {
          stacks: true,
        },
        orderBy: [
          {
            isFeatured: "desc",
          },
          {
            id: "desc",
          },
        ],
      });
      portfolioData = portfolio;
      await redis.set("portfolio.all", JSON.stringify(portfolio));
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
