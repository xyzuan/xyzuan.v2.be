import { createElysia } from "@libs/elysia";
import {
  login,
  logout,
  provider,
  providerCallback,
  signup,
} from "./controller/auth";
import {
  commentBlog,
  createBlog,
  getBlog,
  getBlogBySlug,
  reactionBlog,
} from "./controller/blog";
import {
  getCurrentUser,
  getUserByCUID,
  updateUserProfile,
} from "./controller/user";
import { cloudinaryUpload } from "./controller/assets";
import { getAllMessage, wsMessage } from "./controller/message";
import {
  createPortfolio,
  deletePortfolio,
  getAllPortfolio,
  getPortfolioById,
  updatePortfolio,
} from "./controller/portfolio";
import {
  getAIChatById,
  getCurrentAIChat,
  requestAIChat,
} from "./controller/ai";
import {
  createWork,
  deleteWork,
  getAllWork,
  getWorkById,
  updateWork,
} from "./controller/work";

const apiRoutes = createElysia({ prefix: "v2/" })
  .group("auth", (api) =>
    api.use(login).use(signup).use(logout).use(provider).use(providerCallback)
  )
  .group("me", (api) =>
    api.use(getCurrentUser).use(getUserByCUID).use(updateUserProfile)
  )
  .group("message", (api) => api.use(getAllMessage).use(wsMessage))
  .group("work", (api) =>
    api
      .use(getAllWork)
      .use(getWorkById)
      .use(createWork)
      .use(deleteWork)
      .use(updateWork)
  )
  .group("portfolio", (api) =>
    api
      .use(getAllPortfolio)
      .use(getPortfolioById)
      .use(updatePortfolio)
      .use(createPortfolio)
      .use(deletePortfolio)
  )
  .group("blog", (api) =>
    api
      .use(getBlog)
      .use(getBlogBySlug)
      .use(createBlog)
      .use(commentBlog)
      .use(reactionBlog)
  )
  .group("assets", (api) => api.use(cloudinaryUpload))
  .group("ai", (api) =>
    api.use(getAIChatById).use(getCurrentAIChat).use(requestAIChat)
  );

export default apiRoutes;
