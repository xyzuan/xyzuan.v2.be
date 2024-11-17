import { BadRequestException } from "@constants/exceptions";
import {
  getGithubAccount,
  getGithubTokens,
  githubAuthUrl,
} from "@libs/authGithub";
import {
  getGoogleAccount,
  getGoogleTokens,
  googleAuthUrl,
} from "@libs/authGoogle";
import {
  getLinkedinAccount,
  getLinkedinTokens,
  linkedinAuthUrl,
} from "@libs/authLinkedin";
import { AuthProvider } from "@t/auth";

const genAuthUrl = (
  provider: AuthProvider,
  state: string,
  codeVerifier: string
) => {
  switch (provider) {
    case "google":
      return googleAuthUrl(state, codeVerifier);
    case "github":
      return githubAuthUrl(state);
    case "linkedin":
      return linkedinAuthUrl(state);
    default:
      throw new BadRequestException("Provider not found");
  }
};

const getAuthAccount = async (provider: AuthProvider, accessToken: string) => {
  switch (provider) {
    case "google":
      return await getGoogleAccount(accessToken);
    case "github":
      return await getGithubAccount(accessToken);
    case "linkedin":
      return await getLinkedinAccount(accessToken);
    default:
      throw new Error("Provider not found");
  }
};

const getTokens = async (
  provider: AuthProvider,
  code: string,
  codeVerifier: string
) => {
  switch (provider) {
    case "google":
      return await getGoogleTokens(code, codeVerifier);
    case "github":
      return await getGithubTokens(code);
    case "linkedin":
      return await getLinkedinTokens(code);
    default:
      throw new Error("Provider not found");
  }
};

export { genAuthUrl, getAuthAccount, getTokens };
