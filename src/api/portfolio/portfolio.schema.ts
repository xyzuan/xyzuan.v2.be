import { Portfolio, Prisma } from "@prisma/client";

interface PortfolioWithStackSchema extends Portfolio {
  stacks: string[];
}

type UpdatePortfolioData = Partial<Omit<PortfolioWithStackSchema, "id">> & {
  stacks?: Prisma.PortfolioStackUpdateManyWithoutPortfolioNestedInput;
};

export { PortfolioWithStackSchema, UpdatePortfolioData };
