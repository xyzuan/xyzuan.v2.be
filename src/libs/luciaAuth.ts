import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import type { User } from "@prisma/client";
import { Lucia } from "lucia";
import { prismaClient } from "./prismaDatabase";

const adapter = new PrismaAdapter(prismaClient.session, prismaClient.user);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      email: attributes.email,
      iconUrl: attributes.iconUrl,
      bannerUrl: attributes.bannerUrl,
      isAdmin: attributes.isAdmin,
      headline: attributes.headline,
      location: attributes.location,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  name: User["name"];
  email: User["email"];
  iconUrl: User["iconUrl"];
  bannerUrl: User["bannerUrl"];
  isAdmin: User["isAdmin"];
  headline: User["headline"];
  location: User["location"];
}

export { lucia };
