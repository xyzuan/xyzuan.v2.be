import { createElysia } from "@libs/elysia";
import { PortfolioController } from "./controller/portfolio.controller";
import { WorkController } from "./controller/work.controller";
import { MessageController } from "./controller/message.controller";
import { auth } from "./controller/auth";
import { me } from "./controller/user.controller";
import { BlogController } from "./controller/blog.controller";
import { CloudinaryController } from "./controller/cloudinary.controller";

const apiRoutes = createElysia({ prefix: "v2/" })
  .group("auth", (api) => api.use(auth))
  .group("me", (api) => api.use(me))
  .group("message", (api) => api.use(MessageController))
  .group("work", (api) => api.use(WorkController))
  .group("portfolio", (api) => api.use(PortfolioController))
  .group("blog", (api) => api.use(BlogController))
  .group("assets", (api) => api.use(CloudinaryController));

export default apiRoutes;
