import { BaseAuthAccountInfo } from "@t/auth";
import { LinkedIn as LinkedinInstance } from "arctic";

const clientId = process.env.LINKEDIN_CLIENT_ID!;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
const baseURL = process.env.BASE_URL ?? "http://localhost:3121";

const linkedin = new LinkedinInstance(
  clientId,
  clientSecret,
  `${baseURL}/v2/auth/linkedin/callback`
);

const authUrl = (state: string) =>
  linkedin.createAuthorizationURL(state, ["openid", "profile", "email"]);

const getTokens = async (code: string) =>
  linkedin.validateAuthorizationCode(code);

const getAccount = async (
  accessToken: string
): Promise<BaseAuthAccountInfo> => {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const profile = await response.json();

  return {
    id: profile.id,
    username: profile.name,
    email: profile.email,
    iconUrl: profile.picture,
  };
};

export {
  linkedin,
  authUrl as linkedinAuthUrl,
  getAccount as getLinkedinAccount,
  getTokens as getLinkedinTokens,
};
