import swagger from "@elysiajs/swagger";

export const docs = swagger({
  documentation: {
    info: {
      title: "xyzuan V2 elysiaJS APIs Documentation",
      version: "2.0.0",
    },
    tags: [
      {
        name: "Authorization Service",
        description: "User account service auth endpoints",
      },
      {
        name: "Users",
        description: "User Profile service endpoints",
      },
      {
        name: "Portfolios",
        description: "Jody Yuantoro portofolios endpoints",
      },
      { name: "Works", description: "Jody Yuantoro works endpoints" },
    ],
  },
});
