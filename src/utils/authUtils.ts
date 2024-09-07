import { BadRequestException } from "@constants/exceptions";
import {
  getGoogleAccount,
  getGoogleTokens,
  googleAuthUrl,
} from "@libs/authGoogle";
import { AuthProvider } from "@t/auth.types";

const genAuthUrl = (
  provider: AuthProvider,
  state: string,
  codeVerifier: string
) => {
  switch (provider) {
    case "google":
      return googleAuthUrl(state, codeVerifier);
    default:
      throw new BadRequestException("Provider not found");
  }
};

const getAuthAccount = async (provider: AuthProvider, accessToken: string) => {
  switch (provider) {
    case "google":
      return await getGoogleAccount(accessToken);
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
    default:
      throw new Error("Provider not found");
  }
};

export { genAuthUrl, getAuthAccount, getTokens };
