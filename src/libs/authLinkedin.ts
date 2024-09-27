import { BaseAuthAccountInfo } from "@t/auth.types";
import { LinkedIn as LinkedinInstance } from "arctic";

const clientId = process.env.LINKEDIN_CLIENT_ID!;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
const baseURL = process.env.BASE_URL ?? "http://localhost:3031";

const linkedin = new LinkedinInstance(
  clientId,
  clientSecret,
  `${baseURL}/v2/auth/linkedin/callback`
);

const authUrl = async (state: string) =>
  await linkedin.createAuthorizationURL(state, {
    scopes: ["profile", "email"],
  });

const getTokens = async (code: string) =>
  linkedin.validateAuthorizationCode(code);

const getAccount = async (
  accessToken: string
): Promise<BaseAuthAccountInfo> => {
  const response = await fetch("https://api.linkedin.com/v2/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const profile = await response.json();

  const emailResponse = await fetch(
    "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const emailData = await emailResponse.json();

  if (!profile || !emailData.elements || emailData.elements.length === 0) {
    throw new Error("The user does not have sufficient profile information.");
  }

  const email = emailData.elements[0]["handle~"].emailAddress;
  const name = `${profile.localizedFirstName} ${profile.localizedLastName}`;
  const picture =
    profile.profilePicture?.["displayImage~"]?.elements?.[0]?.identifiers?.[0]
      ?.identifier;

  return {
    id: profile.id,
    username: name,
    email: email,
    iconUrl: picture,
  };
};

export {
  linkedin,
  authUrl as linkedinAuthUrl,
  getAccount as getLinkedinAccount,
  getTokens as getLinkedinTokens,
};
